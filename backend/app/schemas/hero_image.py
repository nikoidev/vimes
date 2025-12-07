"""
Schemas para imágenes del Hero/Galería
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class HeroImageBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    image_url: str = Field(..., max_length=500)
    alt_text: str = Field(..., max_length=200)
    is_active: bool = True
    order: int = 0


class HeroImageCreate(HeroImageBase):
    pass


class HeroImageUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    alt_text: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    order: Optional[int] = None


class HeroImage(HeroImageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
