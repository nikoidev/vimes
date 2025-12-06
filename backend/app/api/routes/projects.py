from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.project import Project, ProjectCreate, ProjectUpdate
from app.services.project_service import ProjectService

router = APIRouter()


@router.get("/", response_model=List[Project])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = False,
    featured_only: bool = False,
    service_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los proyectos (público)"""
    return ProjectService.get_projects(db, skip, limit, published_only, featured_only, service_id)


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Obtener un proyecto por ID (público)"""
    project = ProjectService.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project


@router.get("/slug/{slug}", response_model=Project)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    """Obtener un proyecto por slug (público)"""
    project = ProjectService.get_project_by_slug(db, slug)
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear un nuevo proyecto (requiere autenticación)"""
    # Verificar si el slug ya existe
    existing = ProjectService.get_project_by_slug(db, project.slug)
    if existing:
        raise HTTPException(status_code=400, detail="El slug ya existe")
    
    return ProjectService.create_project(db, project)


@router.put("/{project_id}", response_model=Project)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar un proyecto (requiere autenticación)"""
    db_project = ProjectService.update_project(db, project_id, project)
    if not db_project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un proyecto (requiere autenticación)"""
    if not ProjectService.delete_project(db, project_id):
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
