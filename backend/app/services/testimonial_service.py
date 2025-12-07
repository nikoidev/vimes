from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate


class TestimonialService:
    @staticmethod
    def get_testimonial(db: Session, testimonial_id: int) -> Optional[Testimonial]:
        """Obtener un testimonio por ID"""
        return db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()

    @staticmethod
    def get_testimonials(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        published_only: bool = False,
        featured_only: bool = False,
    ) -> List[Testimonial]:
        """Obtener todos los testimonios"""
        query = db.query(Testimonial)
        if published_only:
            query = query.filter(Testimonial.is_published.is_(True))
        if featured_only:
            query = query.filter(Testimonial.is_featured.is_(True))
        return query.order_by(Testimonial.order).offset(skip).limit(limit).all()

    @staticmethod
    def create_testimonial(db: Session, testimonial: TestimonialCreate) -> Testimonial:
        """Crear un nuevo testimonio"""
        db_testimonial = Testimonial(**testimonial.model_dump())
        db.add(db_testimonial)
        db.commit()
        db.refresh(db_testimonial)
        return db_testimonial

    @staticmethod
    def update_testimonial(
        db: Session, testimonial_id: int, testimonial: TestimonialUpdate
    ) -> Optional[Testimonial]:
        """Actualizar un testimonio existente"""
        db_testimonial = (
            db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
        )
        if not db_testimonial:
            return None

        update_data = testimonial.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_testimonial, field, value)

        db.commit()
        db.refresh(db_testimonial)
        return db_testimonial

    @staticmethod
    def delete_testimonial(db: Session, testimonial_id: int) -> bool:
        """Eliminar un testimonio"""
        db_testimonial = (
            db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
        )
        if not db_testimonial:
            return False

        db.delete(db_testimonial)
        db.commit()
        return True
