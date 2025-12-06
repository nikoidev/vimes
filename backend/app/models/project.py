from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, JSON, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class Project(Base):
    """Modelo para proyectos/portfolio de trabajos realizados"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    client_name = Column(String(200))
    location = Column(String(300))  # Ej: "Maella, Aragón, España"
    
    # Content
    short_description = Column(String(300))
    description = Column(Text)
    challenge = Column(Text)  # Desafío del proyecto
    solution = Column(Text)  # Solución implementada
    results = Column(Text)  # Resultados obtenidos
    
    # Multimedia
    featured_image = Column(String(500))
    gallery = Column(JSON)  # Array de URLs de imágenes del proyecto
    video_url = Column(String(500))  # URL de video (YouTube, Vimeo, etc.)
    
    # Details
    service_id = Column(Integer, ForeignKey("services.id"))  # Servicio relacionado
    tags = Column(JSON)  # Array de tags/categorías
    duration = Column(String(100))  # Ej: "2 semanas", "1 mes"
    completion_date = Column(Date)
    
    # Configuration
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # SEO
    meta_title = Column(String(200))
    meta_description = Column(String(300))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Project {self.title}>"
