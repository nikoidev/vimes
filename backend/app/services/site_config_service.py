from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.site_config import SiteConfig
from app.schemas.site_config import SiteConfigCreate, SiteConfigUpdate


class SiteConfigService:
    @staticmethod
    def get_config(db: Session) -> Optional[SiteConfig]:
        """Obtener la configuración del sitio (siempre debe ser única)"""
        return db.query(SiteConfig).first()

    @staticmethod
    def create_or_update_config(db: Session, config: SiteConfigUpdate) -> SiteConfig:
        """Crear o actualizar la configuración del sitio"""
        db_config = db.query(SiteConfig).first()
        
        if not db_config:
            # Si no existe, crear una nueva
            config_data = config.model_dump(exclude_unset=True)
            db_config = SiteConfig(**config_data)
            db.add(db_config)
        else:
            # Si existe, actualizar
            update_data = config.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_config, field, value)
        
        db.commit()
        db.refresh(db_config)
        return db_config
