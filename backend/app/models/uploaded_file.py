"""
Modelo para gestión de archivos subidos
"""

from sqlalchemy import Boolean, Column, Integer, String, DateTime, BigInteger
from sqlalchemy.sql import func

from app.core.database import Base


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False, unique=True)
    file_type = Column(String(50), nullable=False)  # image, video, document
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)  # bytes
    folder = Column(String(100), nullable=False, index=True)  # hero, services, projects, etc.
    uploaded_by = Column(Integer, nullable=True)  # user_id
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<UploadedFile(filename='{self.filename}', folder='{self.folder}')>"
