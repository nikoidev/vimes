"""
Servicio para gestión de archivos subidos
"""

import hashlib
from pathlib import Path
from typing import List, Optional

from fastapi import UploadFile
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
            .filter(UploadedFile.file_path == file_path, UploadedFile.is_active == True)  # noqa: E712
            .first()
        )

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
            raise ValueError(f"Folder '{folder}' no permitido. Use: {self.ALLOWED_FOLDERS}")

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
                raise ValueError(f"Imagen muy grande: {file_size} bytes (máx {self.MAX_IMAGE_SIZE})")
        elif file_type == "video":
            if folder != "projects":
                raise ValueError("Videos solo permitidos en folder 'projects'")
            if mime_type not in self.ALLOWED_VIDEO_TYPES:
                raise ValueError(f"Tipo de video no permitido: {mime_type}")
            if file_size > self.MAX_VIDEO_SIZE:
                raise ValueError(f"Video muy grande: {file_size} bytes (máx {self.MAX_VIDEO_SIZE})")
        else:
            raise ValueError(f"Tipo de archivo no soportado: {mime_type}")

        # Calcular hash para detección de duplicados
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
            UploadedFile.is_active == True,  # noqa: E712
        )

        total = query.count()
        files = query.order_by(UploadedFile.created_at.desc()).offset(skip).limit(limit).all()

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
            .filter(UploadedFile.id == file_id, UploadedFile.is_active == True)  # noqa: E712
            .first()
        )

    def get_file_path(self, file_id: int) -> Optional[Path]:
        """Obtener path completo del archivo"""
        db_file = self.get_file_by_id(file_id)
        if not db_file:
            return None

        return self.upload_dir / str(db_file.file_path)
