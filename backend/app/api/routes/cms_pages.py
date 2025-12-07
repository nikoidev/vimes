from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.schemas.cms_page import CMSPage, CMSPageCreate, CMSPageUpdate
from app.services.cms_page_service import CMSPageService

router = APIRouter()


@router.get("/", response_model=List[CMSPage])
def get_pages(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = False,
    db: Session = Depends(get_db),
):
    """Obtener todas las páginas"""
    return CMSPageService.get_pages(db, skip, limit, published_only)


@router.get("/homepage", response_model=CMSPage)
def get_homepage(db: Session = Depends(get_db)):
    """Obtener la página de inicio (público)"""
    page = CMSPageService.get_homepage(db)
    if not page:
        raise HTTPException(status_code=404, detail="Página de inicio no encontrada")
    return page


@router.get("/{page_id}", response_model=CMSPage)
def get_page(page_id: int, db: Session = Depends(get_db)):
    """Obtener una página por ID"""
    page = CMSPageService.get_page(db, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    return page


@router.get("/slug/{slug}", response_model=CMSPage)
def get_page_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtener una página por slug (público)"""
    page = CMSPageService.get_page_by_slug(db, slug)
    if not page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    return page


@router.post("/", response_model=CMSPage, status_code=status.HTTP_201_CREATED)
def create_page(
    page: CMSPageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Crear una nueva página (requiere autenticación)"""
    # Verificar si el slug ya existe
    existing = CMSPageService.get_page_by_slug(db, page.slug)
    if existing:
        raise HTTPException(status_code=400, detail="El slug ya existe")

    return CMSPageService.create_page(db, page)


@router.put("/{page_id}", response_model=CMSPage)
def update_page(
    page_id: int,
    page: CMSPageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Actualizar una página (requiere autenticación)"""
    db_page = CMSPageService.update_page(db, page_id, page)
    if not db_page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    return db_page


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Eliminar una página (requiere autenticación)"""
    if not CMSPageService.delete_page(db, page_id):
        raise HTTPException(status_code=404, detail="Página no encontrada")
