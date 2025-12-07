from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class SiteConfig(Base):
    """Modelo para configuración general del sitio"""

    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, index=True)

    # Company Info
    company_name = Column(String(200), default="Excavaciones Maella")
    tagline = Column(String(300))
    description = Column(Text)

    # Contact Info
    email = Column(String(200))
    phone = Column(String(50))
    whatsapp = Column(String(50))
    address = Column(Text)
    city = Column(String(100), default="Maella")
    province = Column(String(100), default="Zaragoza")
    postal_code = Column(String(20))
    country = Column(String(100), default="España")

    # Geolocation
    latitude = Column(String(50))
    longitude = Column(String(50))

    # Social Media
    social_facebook = Column(String(300))
    social_instagram = Column(String(300))
    social_twitter = Column(String(300))
    social_linkedin = Column(String(300))
    social_youtube = Column(String(300))

    # Branding
    logo = Column(String(500))
    logo_dark = Column(String(500))
    favicon = Column(String(500))
    primary_color = Column(String(20), default="#f97316")  # Orange
    secondary_color = Column(String(20), default="#1e40af")  # Blue

    # Business Hours
    business_hours = Column(JSON)  # JSON con horarios por día

    # SEO Default
    default_meta_title = Column(String(200))
    default_meta_description = Column(String(300))
    default_meta_keywords = Column(String(500))
    default_og_image = Column(String(500))

    # Footer
    footer_text = Column(Text)
    footer_links = Column(JSON)  # Links adicionales del footer

    # Scripts
    google_analytics_id = Column(String(100))
    google_maps_api_key = Column(String(200))
    facebook_pixel_id = Column(String(100))

    # Configuration
    maintenance_mode = Column(Boolean, default=False)
    maintenance_message = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<SiteConfig {self.company_name}>"
