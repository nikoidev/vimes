"""
Servicio para gestión de imágenes del Hero
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.hero_image import HeroImage
from app.schemas.hero_image import HeroImageCreate, HeroImageUpdate


class HeroImageService:
    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False
    ) -> List[HeroImage]:
        query = db.query(HeroImage)
        
        if active_only:
            query = query.filter(HeroImage.is_active == True)
        
        return query.order_by(HeroImage.order).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, image_id: int) -> Optional[HeroImage]:
        return db.query(HeroImage).filter(HeroImage.id == image_id).first()

    @staticmethod
    def create(db: Session, image: HeroImageCreate) -> HeroImage:
        db_image = HeroImage(**image.model_dump())
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
        return db_image

    @staticmethod
    def update(db: Session, image_id: int, image: HeroImageUpdate) -> Optional[HeroImage]:
        db_image = HeroImageService.get_by_id(db, image_id)
        if not db_image:
            return None

        update_data = image.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_image, field, value)

        db.commit()
        db.refresh(db_image)
        return db_image

    @staticmethod
    def delete(db: Session, image_id: int) -> bool:
        db_image = HeroImageService.get_by_id(db, image_id)
        if not db_image:
            return False

        db.delete(db_image)
        db.commit()
        return True
