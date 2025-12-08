"""
Schemas para gestión de archivos
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UploadedFileBase(BaseModel):
    filename: str
    original_filename: str
    file_path: str
    file_type: str
    mime_type: str
    file_size: int
    folder: str


class UploadedFileCreate(UploadedFileBase):
    uploaded_by: Optional[int] = None


class UploadedFileUpdate(BaseModel):
    filename: Optional[str] = None
    is_active: Optional[bool] = None


class UploadedFile(UploadedFileBase):
    id: int
    uploaded_by: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
