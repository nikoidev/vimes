from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Testimonial(Base):
    """Modelo para testimonios de clientes"""

    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(200), nullable=False)
    client_position = Column(String(200))  # Ej: "Propietario", "Agricultor"
    client_company = Column(String(200))
    client_location = Column(String(200))  # Ej: "Maella, Zaragoza"

    # Content
    testimonial = Column(Text, nullable=False)
    rating = Column(Float, default=5.0)  # Valoración de 0 a 5

    # Multimedia
    client_photo = Column(String(500))  # Foto del cliente

    # Configuration
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Testimonial {self.client_name}>"
