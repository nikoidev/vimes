from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.testimonial import Testimonial, TestimonialCreate, TestimonialUpdate
from app.services.testimonial_service import TestimonialService

router = APIRouter()


@router.get("/", response_model=List[Testimonial])
def get_testimonials(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    """Obtener todos los testimonios (público)"""
    return TestimonialService.get_testimonials(
        db, skip, limit, published_only, featured_only
    )


@router.get("/{testimonial_id}", response_model=Testimonial)
def get_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    """Obtener un testimonio por ID"""
    testimonial = TestimonialService.get_testimonial(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
    return testimonial


@router.post("/", response_model=Testimonial, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Crear un nuevo testimonio (requiere autenticación)"""
    return TestimonialService.create_testimonial(db, testimonial)


@router.put("/{testimonial_id}", response_model=Testimonial)
def update_testimonial(
    testimonial_id: int,
    testimonial: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Actualizar un testimonio (requiere autenticación)"""
    db_testimonial = TestimonialService.update_testimonial(
        db, testimonial_id, testimonial
    )
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
    return db_testimonial


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Eliminar un testimonio (requiere autenticación)"""
    if not TestimonialService.delete_testimonial(db, testimonial_id):
        raise HTTPException(status_code=404, detail="Testimonio no encontrado")
