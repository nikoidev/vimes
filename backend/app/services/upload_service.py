"""
Servicio para gestión de archivos subidos
"""

import hashlib
from io import BytesIO
from pathlib import Path
from typing import List, Optional

from fastapi import UploadFile
from PIL import Image
from sqlalchemy.orm import Session

from app.models.uploaded_file import UploadedFile


class UploadService:
    """Servicio para gestión de archivos"""

    # Carpetas permitidas
    ALLOWED_FOLDERS = ["hero", "services", "projects"]

    # Tipos de archivo permitidos
    ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]

    # Tamaño máximo de archivo (20MB para imágenes, 100MB para videos)
    MAX_IMAGE_SIZE = 20 * 1024 * 1024  # 20MB
    MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB

    def __init__(self, db: Session, upload_dir: str = "uploads"):
        self.db = db
        self.upload_dir = Path(upload_dir)
        self._ensure_directories()

    def _ensure_directories(self) -> None:
        """Crear directorios necesarios"""
        for folder in self.ALLOWED_FOLDERS:
            folder_path = self.upload_dir / folder
            folder_path.mkdir(parents=True, exist_ok=True)

    def _calculate_file_hash(self, file_content: bytes) -> str:
        """Calcular hash SHA-256 del contenido del archivo"""
        return hashlib.sha256(file_content).hexdigest()

    def _get_file_extension(self, filename: str) -> str:
        """Obtener extensión del archivo"""
        return Path(filename).suffix.lower()

    def _generate_unique_filename(
        self,
        original_filename: str,
        file_hash: str,
    ) -> str:
        """Generar nombre único para el archivo basado en hash"""
        extension = self._get_file_extension(original_filename)
        # Usar los primeros 12 caracteres del hash + extensión original
        return f"{file_hash[:12]}{extension}"

    def _check_duplicate(self, file_path: str) -> Optional[UploadedFile]:
        """Verificar si ya existe un archivo con la misma ruta"""
        return (
            self.db.query(UploadedFile)
            .filter(
                UploadedFile.file_path == file_path, UploadedFile.is_active.is_(True)
            )
            .first()
        )

    def _resize_image(self, image_content: bytes, folder: str, mime_type: str) -> bytes:
        """
        Redimensionar imagen según el folder de destino

        Args:
            image_content: Contenido de la imagen
            folder: Carpeta destino (hero/services/projects)
            mime_type: Tipo MIME de la imagen

        Returns:
            bytes: Contenido de la imagen redimensionada
        """
        # Definir tamaños objetivo por folder
        target_sizes = {
            "hero": (1920, 1080),  # 16:9 para hero images
            "services": (800, 600),  # 4:3 para servicios
            "projects": (1200, 800),  # 3:2 para proyectos
        }

        target_size = target_sizes.get(folder, (1920, 1080))

        try:
            # Abrir imagen
            img = Image.open(BytesIO(image_content))

            # Convertir a RGB si es necesario (para JPG)
            if img.mode in ("RGBA", "LA", "P"):
                # Crear fondo blanco para transparencias
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(
                    img, mask=img.split()[-1] if img.mode == "RGBA" else None
                )
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # Calcular dimensiones manteniendo aspect ratio
            img_ratio = img.width / img.height
            target_ratio = target_size[0] / target_size[1]

            if img_ratio > target_ratio:
                # Imagen más ancha, ajustar por altura
                new_height = target_size[1]
                new_width = int(new_height * img_ratio)
            else:
                # Imagen más alta, ajustar por ancho
                new_width = target_size[0]
                new_height = int(new_width / img_ratio)

            # Redimensionar
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Recortar al tamaño objetivo (centrado)
            left = (new_width - target_size[0]) // 2
            top = (new_height - target_size[1]) // 2
            right = left + target_size[0]
            bottom = top + target_size[1]

            img = img.crop((left, top, right, bottom))

            # Guardar en BytesIO
            output = BytesIO()

            # Determinar formato de salida
            format_map = {
                "image/jpeg": "JPEG",
                "image/jpg": "JPEG",
                "image/png": "PNG",
                "image/webp": "WEBP",
            }
            output_format = format_map.get(mime_type, "JPEG")

            # Guardar con calidad optimizada
            if output_format == "JPEG":
                img.save(output, format=output_format, quality=85, optimize=True)
            else:
                img.save(output, format=output_format, optimize=True)

            return output.getvalue()

        except Exception as e:
            # Si falla el redimensionamiento, retornar contenido original
            print(f"Error resizing image: {e}")
            return image_content

    async def save_file(
        self,
        file: UploadFile,
        folder: str,
        user_id: Optional[int] = None,
    ) -> UploadedFile:
        """
        Guardar archivo con detección de duplicados

        Args:
            file: Archivo a subir
            folder: Carpeta destino (hero/services/projects)
            user_id: ID del usuario que sube el archivo

        Returns:
            UploadedFile: Registro del archivo en DB

        Raises:
            ValueError: Si el folder no es válido o el archivo no es permitido
        """
        # Validar folder
        if folder not in self.ALLOWED_FOLDERS:
            raise ValueError(
                f"Folder '{folder}' no permitido. Use: {self.ALLOWED_FOLDERS}"
            )

        # Leer contenido del archivo
        file_content = await file.read()
        file_size = len(file_content)

        # Validar tipo y tamaño
        mime_type = file.content_type or "application/octet-stream"
        file_type = self._get_file_type(mime_type)

        if file_type == "image":
            if mime_type not in self.ALLOWED_IMAGE_TYPES:
                raise ValueError(f"Tipo de imagen no permitido: {mime_type}")
            if file_size > self.MAX_IMAGE_SIZE:
                raise ValueError(
                    f"Imagen muy grande: {file_size} bytes (máx {self.MAX_IMAGE_SIZE})"
                )

            # Redimensionar imagen automáticamente
            file_content = self._resize_image(file_content, folder, mime_type)
            file_size = len(
                file_content
            )  # Actualizar tamaño después del redimensionamiento

        elif file_type == "video":
            if folder != "projects":
                raise ValueError("Videos solo permitidos en folder 'projects'")
            if mime_type not in self.ALLOWED_VIDEO_TYPES:
                raise ValueError(f"Tipo de video no permitido: {mime_type}")
            if file_size > self.MAX_VIDEO_SIZE:
                raise ValueError(
                    f"Video muy grande: {file_size} bytes (máx {self.MAX_VIDEO_SIZE})"
                )
        else:
            raise ValueError(f"Tipo de archivo no soportado: {mime_type}")

        # Calcular hash para detección de duplicados (después del redimensionamiento)
        file_hash = self._calculate_file_hash(file_content)
        original_filename = file.filename or "unknown"
        unique_filename = self._generate_unique_filename(original_filename, file_hash)

        # Construir path relativo
        relative_path = f"{folder}/{unique_filename}"
        full_path = self.upload_dir / relative_path

        # Verificar si ya existe (por path)
        existing_file = self._check_duplicate(str(relative_path))
        if existing_file:
            # Archivo duplicado, retornar el existente
            return existing_file

        # Guardar archivo físico
        with open(full_path, "wb") as f:
            f.write(file_content)

        # Crear registro en DB
        db_file = UploadedFile(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=str(relative_path),
            file_type=file_type,
            mime_type=mime_type,
            file_size=file_size,
            folder=folder,
            uploaded_by=user_id,
            is_active=True,
        )

        self.db.add(db_file)
        self.db.commit()
        self.db.refresh(db_file)

        return db_file

    def _get_file_type(self, mime_type: str) -> str:
        """Determinar tipo de archivo desde mime_type"""
        if mime_type in self.ALLOWED_IMAGE_TYPES:
            return "image"
        elif mime_type in self.ALLOWED_VIDEO_TYPES:
            return "video"
        else:
            return "unknown"

    def get_files_by_folder(
        self,
        folder: str,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[List[UploadedFile], int]:
        """
        Obtener archivos de una carpeta específica

        Returns:
            tuple: (lista de archivos, total)
        """
        query = self.db.query(UploadedFile).filter(
            UploadedFile.folder == folder,
            UploadedFile.is_active.is_(True),
        )

        total = query.count()
        files = (
            query.order_by(UploadedFile.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

        return files, total

    def delete_file(self, file_id: int) -> bool:
        """
        Eliminar archivo (soft delete)

        Args:
            file_id: ID del archivo

        Returns:
            bool: True si se eliminó correctamente
        """
        db_file = self.db.query(UploadedFile).filter(UploadedFile.id == file_id).first()

        if not db_file:
            return False

        # Soft delete
        setattr(db_file, "is_active", False)
        self.db.commit()

        # Opcional: eliminar archivo físico
        # full_path = self.upload_dir / db_file.file_path
        # if full_path.exists():
        #     full_path.unlink()

        return True

    def delete_file_permanent(self, file_id: int) -> bool:
        """
        Eliminar archivo permanentemente (hard delete)

        Args:
            file_id: ID del archivo

        Returns:
            bool: True si se eliminó correctamente
        """
        db_file = self.db.query(UploadedFile).filter(UploadedFile.id == file_id).first()

        if not db_file:
            return False

        # Eliminar archivo físico
        full_path = self.upload_dir / db_file.file_path
        if full_path.exists():
            full_path.unlink()

        # Eliminar registro de DB
        self.db.delete(db_file)
        self.db.commit()

        return True

    def get_file_by_id(self, file_id: int) -> Optional[UploadedFile]:
        """Obtener archivo por ID"""
        return (
            self.db.query(UploadedFile)
            .filter(UploadedFile.id == file_id, UploadedFile.is_active.is_(True))
            .first()
        )

    def get_file_path(self, file_id: int) -> Optional[Path]:
        """Obtener path completo del archivo"""
        db_file = self.get_file_by_id(file_id)
        if not db_file:
            return None

        return self.upload_dir / str(db_file.file_path)
