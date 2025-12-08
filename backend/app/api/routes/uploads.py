"""
Rutas API para gestión de archivos subidos
"""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import check_permission, get_current_user, get_db
from app.models.user import User
from app.schemas.uploaded_file import UploadedFile as UploadedFileSchema
from app.services.upload_service import UploadService

router = APIRouter()


@router.post("/", response_model=UploadedFileSchema)
async def upload_file(
    folder: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: bool = Depends(check_permission("uploads", "create")),
) -> UploadedFileSchema:
    """
    Subir un archivo

    Parámetros:
    - folder: Carpeta destino (hero/services/projects)
    - file: Archivo a subir

    Retorna el archivo subido (o existente si es duplicado)
    """
    try:
        upload_service = UploadService(db)
        uploaded_file = await upload_service.save_file(
            file=file,
            folder=folder,
            user_id=current_user.id,  # type: ignore[arg-type]
        )
        return uploaded_file
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir archivo: {str(e)}")


@router.get("/{folder}", response_model=dict)
async def list_files_by_folder(
    folder: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
    __: bool = Depends(check_permission("uploads", "read")),
) -> dict:
    """
    Listar archivos de una carpeta

    Parámetros:
    - folder: Carpeta (hero/services/projects)
    - skip: Offset para paginación
    - limit: Cantidad de resultados
    """
    try:
        upload_service = UploadService(db)
        files, total = upload_service.get_files_by_folder(folder, skip, limit)
        return {"files": files, "total": total, "skip": skip, "limit": limit}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar archivos: {str(e)}")


@router.delete("/{file_id}", response_model=dict)
async def delete_file(
    file_id: int,
    permanent: bool = False,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
    __: bool = Depends(check_permission("uploads", "delete")),
) -> dict:
    """
    Eliminar un archivo

    Parámetros:
    - file_id: ID del archivo
    - permanent: Si es True, elimina permanentemente. Si es False, hace soft delete
    """
    try:
        upload_service = UploadService(db)

        if permanent:
            success = upload_service.delete_file_permanent(file_id)
        else:
            success = upload_service.delete_file(file_id)

        if not success:
            raise HTTPException(status_code=404, detail="Archivo no encontrado")

        return {"message": "Archivo eliminado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar archivo: {str(e)}")


@router.get("/file/{file_id}", response_model=UploadedFileSchema)
async def get_file_info(
    file_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
    __: bool = Depends(check_permission("uploads", "read")),
) -> UploadedFileSchema:
    """
    Obtener información de un archivo

    Parámetros:
    - file_id: ID del archivo
    """
    upload_service = UploadService(db)
    file_info = upload_service.get_file_by_id(file_id)

    if not file_info:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    return file_info
