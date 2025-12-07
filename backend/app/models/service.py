from sqlalchemy import JSON, Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Service(Base):
    """Modelo para servicios de la empresa (excavaciones, tuberías, etc.)"""

    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    short_description = Column(String(300))
    description = Column(Text)

    # Multimedia
    icon = Column(String(100))  # Nombre del icono (ej: "excavation", "pipe")
    image = Column(String(500))  # URL de la imagen principal
    gallery = Column(JSON)  # Array de URLs de imágenes

    # Características
    features = Column(JSON)  # Array de características del servicio

    # Pricing (opcional)
    price_from = Column(Float)
    price_text = Column(String(200))  # Ej: "Desde 50€/hora"

    # Configuration
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # SEO
    meta_title = Column(String(200))
    meta_description = Column(String(300))

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Service {self.title}>"
