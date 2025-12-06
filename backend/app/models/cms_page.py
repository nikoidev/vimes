from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class CMSPage(Base):
    """Modelo para páginas del CMS con SEO"""
    __tablename__ = "cms_pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    
    # SEO Fields
    meta_title = Column(String(200))
    meta_description = Column(String(300))
    meta_keywords = Column(String(500))
    og_image = Column(String(500))  # URL de imagen para Open Graph
    
    # Content
    content = Column(Text)
    sections = Column(JSON)  # JSON con secciones editables de la página
    
    # Configuration
    is_published = Column(Boolean, default=False)
    is_homepage = Column(Boolean, default=False)
    template = Column(String(100), default="default")  # Tipo de plantilla
    order = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<CMSPage {self.title}>"
