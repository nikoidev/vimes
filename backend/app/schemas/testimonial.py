from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TestimonialBase(BaseModel):
    client_name: str = Field(..., max_length=200)
    client_position: Optional[str] = Field(None, max_length=200)
    client_company: Optional[str] = Field(None, max_length=200)
    client_location: Optional[str] = Field(None, max_length=200)
    testimonial: str
    rating: float = Field(5.0, ge=0, le=5)
    client_photo: Optional[str] = None
    is_published: bool = False
    is_featured: bool = False
    order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = Field(None, max_length=200)
    client_position: Optional[str] = Field(None, max_length=200)
    client_company: Optional[str] = Field(None, max_length=200)
    client_location: Optional[str] = Field(None, max_length=200)
    testimonial: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    client_photo: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None


class Testimonial(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
