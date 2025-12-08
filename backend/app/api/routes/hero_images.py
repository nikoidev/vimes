"""
API routes para imágenes del Hero/Galería
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import check_permission, get_db
from app.models.user import User
from app.schemas.hero_image import HeroImage, HeroImageCreate, HeroImageUpdate
from app.services.hero_image_service import HeroImageService

router = APIRouter()


@router.get("/", response_model=List[HeroImage])
def get_hero_images(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
    db: Session = Depends(get_db),
):
    """
    Obtener todas las imágenes del hero.
    - active_only: Solo imágenes activas
    """
    return HeroImageService.get_all(db, skip=skip, limit=limit, active_only=active_only)


@router.get("/{image_id}", response_model=HeroImage)
def get_hero_image(image_id: int, db: Session = Depends(get_db)):
    """Obtener una imagen del hero por ID"""
    image = HeroImageService.get_by_id(db, image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Imagen no encontrada"
        )
    return image


@router.post("/", response_model=HeroImage, status_code=status.HTTP_201_CREATED)
def create_hero_image(
    image: HeroImageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("hero_images", "create")),
):
    """Crear una nueva imagen del hero (requiere permiso hero_images.create)"""
    return HeroImageService.create(db, image)


@router.put("/{image_id}", response_model=HeroImage)
def update_hero_image(
    image_id: int,
    image: HeroImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("hero_images", "update")),
):
    """Actualizar una imagen del hero (requiere permiso hero_images.update)"""
    updated_image = HeroImageService.update(db, image_id, image)
    if not updated_image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Imagen no encontrada"
        )
    return updated_image


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hero_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("hero_images", "delete")),
):
    """Eliminar una imagen del hero (requiere permiso hero_images.delete)"""
    if not HeroImageService.delete(db, image_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Imagen no encontrada"
        )
