from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ServiceBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=200)
    short_description: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    features: Optional[List[str]] = None
    price_from: Optional[float] = None
    price_text: Optional[str] = Field(None, max_length=200)
    is_active: bool = True
    is_featured: bool = False
    order: int = 0
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    short_description: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    features: Optional[List[str]] = None
    price_from: Optional[float] = None
    price_text: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)


class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
