from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class CMSPageBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=200)
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)
    meta_keywords: Optional[str] = Field(None, max_length=500)
    og_image: Optional[str] = None
    content: Optional[str] = None
    sections: Optional[List[Any]] = None
    is_published: bool = False
    is_homepage: bool = False
    template: str = "default"
    order: int = 0


class CMSPageCreate(CMSPageBase):
    pass


class CMSPageUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    slug: Optional[str] = Field(None, max_length=200)
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None, max_length=300)
    meta_keywords: Optional[str] = Field(None, max_length=500)
    og_image: Optional[str] = None
    content: Optional[str] = None
    sections: Optional[List[Any]] = None
    is_published: Optional[bool] = None
    is_homepage: Optional[bool] = None
    template: Optional[str] = None
    order: Optional[int] = None


class CMSPage(CMSPageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
