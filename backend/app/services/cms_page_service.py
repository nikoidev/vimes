from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.cms_page import CMSPage
from app.schemas.cms_page import CMSPageCreate, CMSPageUpdate


class CMSPageService:
    @staticmethod
    def get_page(db: Session, page_id: int) -> Optional[CMSPage]:
        """Obtener una página por ID"""
        return db.query(CMSPage).filter(CMSPage.id == page_id).first()

    @staticmethod
    def get_page_by_slug(db: Session, slug: str) -> Optional[CMSPage]:
        """Obtener una página por slug"""
        return db.query(CMSPage).filter(CMSPage.slug == slug).first()

    @staticmethod
    def get_homepage(db: Session) -> Optional[CMSPage]:
        """Obtener la página de inicio"""
        return (
            db.query(CMSPage)
            .filter(CMSPage.is_homepage == True, CMSPage.is_published == True)
            .first()
        )

    @staticmethod
    def get_pages(
        db: Session, skip: int = 0, limit: int = 100, published_only: bool = False
    ) -> List[CMSPage]:
        """Obtener todas las páginas"""
        query = db.query(CMSPage)
        if published_only:
            query = query.filter(CMSPage.is_published == True)
        return query.order_by(CMSPage.order).offset(skip).limit(limit).all()

    @staticmethod
    def create_page(db: Session, page: CMSPageCreate) -> CMSPage:
        """Crear una nueva página"""
        db_page = CMSPage(**page.model_dump())
        db.add(db_page)
        db.commit()
        db.refresh(db_page)
        return db_page

    @staticmethod
    def update_page(
        db: Session, page_id: int, page: CMSPageUpdate
    ) -> Optional[CMSPage]:
        """Actualizar una página existente"""
        db_page = db.query(CMSPage).filter(CMSPage.id == page_id).first()
        if not db_page:
            return None

        update_data = page.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_page, field, value)

        db.commit()
        db.refresh(db_page)
        return db_page

    @staticmethod
    def delete_page(db: Session, page_id: int) -> bool:
        """Eliminar una página"""
        db_page = db.query(CMSPage).filter(CMSPage.id == page_id).first()
        if not db_page:
            return False

        db.delete(db_page)
        db.commit()
        return True
