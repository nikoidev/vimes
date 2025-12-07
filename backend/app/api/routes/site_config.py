from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import check_permission, get_db
from app.models.user import User
from app.schemas.site_config import SiteConfig, SiteConfigUpdate
from app.services.site_config_service import SiteConfigService

router = APIRouter()


@router.get("/", response_model=SiteConfig)
def get_site_config(db: Session = Depends(get_db)):
    """Obtener la configuración del sitio (público)"""
    config = SiteConfigService.get_config(db)
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    return config


@router.put("/", response_model=SiteConfig)
def update_site_config(
    config: SiteConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("site_config", "update")),
):
    """Actualizar la configuración del sitio (requiere permiso site_config.update)"""
    return SiteConfigService.create_or_update_config(db, config)
