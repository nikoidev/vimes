from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=200)
    client_name: Optional[str] = Field(None, max_length=200)
    location: Optional[str] = Field(None, max_length=300)
    short_description: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[str] = None
    featured_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    video_url: Optional[str] = None
    service_id: Optional[int] = None
    tags: Optional[List[str]] = None
    duration: Optional[str] = Field(None, max_length=100)
    completion_date: Optional[date] = None
    is_published: bool = False
    is_featured: bool = False
    order: int = 0
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    client_name: Optional[str] = Field(None, max_length=200)
    location: Optional[str] = Field(None, max_length=300)
    short_description: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[str] = None
    featured_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    video_url: Optional[str] = None
    service_id: Optional[int] = None
    tags: Optional[List[str]] = None
    duration: Optional[str] = Field(None, max_length=100)
    completion_date: Optional[date] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
