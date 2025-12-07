import enum

from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class ContactLead(Base):
    """Modelo para leads/solicitudes de contacto del formulario"""

    __tablename__ = "contact_leads"

    id = Column(Integer, primary_key=True, index=True)

    # Contact Info
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(50))
    company = Column(String(200))
    location = Column(String(300))

    # Message
    subject = Column(String(300))
    message = Column(Text, nullable=False)
    service_interest = Column(String(200))  # Servicio de interés

    # Management
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW)
    notes = Column(Text)  # Notas internas del equipo
    assigned_to = Column(Integer)  # ID del usuario asignado

    # Tracking
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    referrer = Column(String(500))

    # Configuration
    is_read = Column(Boolean, default=False)
    is_spam = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<ContactLead {self.name} - {self.email}>"
