from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


class ServiceService:
    @staticmethod
    def get_service(db: Session, service_id: int) -> Optional[Service]:
        """Obtener un servicio por ID"""
        return db.query(Service).filter(Service.id == service_id).first()

    @staticmethod
    def get_service_by_slug(db: Session, slug: str) -> Optional[Service]:
        """Obtener un servicio por slug"""
        return db.query(Service).filter(Service.slug == slug).first()

    @staticmethod
    def get_services(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False,
        featured_only: bool = False,
    ) -> List[Service]:
        """Obtener todos los servicios"""
        query = db.query(Service)
        if active_only:
            query = query.filter(Service.is_active == True)
        if featured_only:
            query = query.filter(Service.is_featured == True)
        return query.order_by(Service.order).offset(skip).limit(limit).all()

    @staticmethod
    def create_service(db: Session, service: ServiceCreate) -> Service:
        """Crear un nuevo servicio"""
        db_service = Service(**service.model_dump())
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        return db_service

    @staticmethod
    def update_service(
        db: Session, service_id: int, service: ServiceUpdate
    ) -> Optional[Service]:
        """Actualizar un servicio existente"""
        db_service = db.query(Service).filter(Service.id == service_id).first()
        if not db_service:
            return None

        update_data = service.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_service, field, value)

        db.commit()
        db.refresh(db_service)
        return db_service

    @staticmethod
    def delete_service(db: Session, service_id: int) -> bool:
        """Eliminar un servicio"""
        db_service = db.query(Service).filter(Service.id == service_id).first()
        if not db_service:
            return False

        db.delete(db_service)
        db.commit()
        return True
