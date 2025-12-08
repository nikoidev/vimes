from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import check_permission, get_db
from app.models.user import User
from app.schemas.service import Service, ServiceCreate, ServiceUpdate
from app.services.service_service import ServiceService

router = APIRouter()


@router.get("/", response_model=List[Service])
def get_services(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    """Obtener todos los servicios (público)"""
    return ServiceService.get_services(db, skip, limit, active_only, featured_only)


@router.get("/{service_id}", response_model=Service)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Obtener un servicio por ID (público)"""
    service = ServiceService.get_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return service


@router.get("/slug/{slug}", response_model=Service)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtener un servicio por slug (público)"""
    service = ServiceService.get_service_by_slug(db, slug)
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return service


@router.post("/", response_model=Service, status_code=status.HTTP_201_CREATED)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("services", "create")),
):
    """Crear un nuevo servicio (requiere permiso services.create)"""
    # Verificar si el slug ya existe
    existing = ServiceService.get_service_by_slug(db, service.slug)
    if existing:
        raise HTTPException(status_code=400, detail="El slug ya existe")

    return ServiceService.create_service(db, service)


@router.put("/{service_id}", response_model=Service)
def update_service(
    service_id: int,
    service: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("services", "update")),
):
    """Actualizar un servicio (requiere permiso services.update)"""
    db_service = ServiceService.update_service(db, service_id, service)
    if not db_service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return db_service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("services", "delete")),
):
    """Eliminar un servicio (requiere permiso services.delete)"""
    if not ServiceService.delete_service(db, service_id):
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
