from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class SiteConfigBase(BaseModel):
    company_name: str = Field(..., max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    whatsapp: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    city: str = Field("Maella", max_length=100)
    province: str = Field("Zaragoza", max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: str = Field("España", max_length=100)
    latitude: Optional[str] = Field(None, max_length=50)
    longitude: Optional[str] = Field(None, max_length=50)
    social_facebook: Optional[str] = None
    social_instagram: Optional[str] = None
    social_twitter: Optional[str] = None
    social_linkedin: Optional[str] = None
    social_youtube: Optional[str] = None
    logo: Optional[str] = None
    logo_dark: Optional[str] = None
    favicon: Optional[str] = None
    primary_color: str = Field("#f97316", max_length=20)
    secondary_color: str = Field("#1e40af", max_length=20)
    business_hours: Optional[Dict[str, Any]] = None
    default_meta_title: Optional[str] = Field(None, max_length=200)
    default_meta_description: Optional[str] = Field(None, max_length=300)
    default_meta_keywords: Optional[str] = Field(None, max_length=500)
    default_og_image: Optional[str] = None
    footer_text: Optional[str] = None
    footer_links: Optional[List[Dict[str, str]]] = None
    google_analytics_id: Optional[str] = Field(None, max_length=100)
    google_maps_api_key: Optional[str] = Field(None, max_length=200)
    facebook_pixel_id: Optional[str] = Field(None, max_length=100)
    maintenance_mode: bool = False
    maintenance_message: Optional[str] = None


class SiteConfigCreate(SiteConfigBase):
    pass


class SiteConfigUpdate(BaseModel):
    company_name: Optional[str] = Field(None, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    whatsapp: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    province: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    latitude: Optional[str] = Field(None, max_length=50)
    longitude: Optional[str] = Field(None, max_length=50)
    social_facebook: Optional[str] = None
    social_instagram: Optional[str] = None
    social_twitter: Optional[str] = None
    social_linkedin: Optional[str] = None
    social_youtube: Optional[str] = None
    logo: Optional[str] = None
    logo_dark: Optional[str] = None
    favicon: Optional[str] = None
    primary_color: Optional[str] = Field(None, max_length=20)
    secondary_color: Optional[str] = Field(None, max_length=20)
    business_hours: Optional[Dict[str, Any]] = None
    default_meta_title: Optional[str] = Field(None, max_length=200)
    default_meta_description: Optional[str] = Field(None, max_length=300)
    default_meta_keywords: Optional[str] = Field(None, max_length=500)
    default_og_image: Optional[str] = None
    footer_text: Optional[str] = None
    footer_links: Optional[List[Dict[str, str]]] = None
    google_analytics_id: Optional[str] = Field(None, max_length=100)
    google_maps_api_key: Optional[str] = Field(None, max_length=200)
    facebook_pixel_id: Optional[str] = Field(None, max_length=100)
    maintenance_mode: Optional[bool] = None
    maintenance_message: Optional[str] = None


class SiteConfig(SiteConfigBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
