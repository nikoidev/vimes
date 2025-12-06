from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    @staticmethod
    def get_project(db: Session, project_id: int) -> Optional[Project]:
        """Obtener un proyecto por ID"""
        return db.query(Project).filter(Project.id == project_id).first()

    @staticmethod
    def get_project_by_slug(db: Session, slug: str) -> Optional[Project]:
        """Obtener un proyecto por slug"""
        return db.query(Project).filter(Project.slug == slug).first()

    @staticmethod
    def get_projects(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        published_only: bool = False,
        featured_only: bool = False,
        service_id: Optional[int] = None
    ) -> List[Project]:
        """Obtener todos los proyectos"""
        query = db.query(Project)
        if published_only:
            query = query.filter(Project.is_published == True)
        if featured_only:
            query = query.filter(Project.is_featured == True)
        if service_id:
            query = query.filter(Project.service_id == service_id)
        return query.order_by(Project.order.desc(), Project.completion_date.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def create_project(db: Session, project: ProjectCreate) -> Project:
        """Crear un nuevo proyecto"""
        db_project = Project(**project.model_dump())
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def update_project(db: Session, project_id: int, project: ProjectUpdate) -> Optional[Project]:
        """Actualizar un proyecto existente"""
        db_project = db.query(Project).filter(Project.id == project_id).first()
        if not db_project:
            return None
        
        update_data = project.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def delete_project(db: Session, project_id: int) -> bool:
        """Eliminar un proyecto"""
        db_project = db.query(Project).filter(Project.id == project_id).first()
        if not db_project:
            return False
        
        db.delete(db_project)
        db.commit()
        return True
