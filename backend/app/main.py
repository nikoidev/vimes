from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.routes import (
    audit_logs,
    auth,
    cms_pages,
    contact,
    hero_images,
    permissions,
    profile,
    projects,
    roles,
    services,
    site_config,
    testimonials,
    uploads,
    users,
)
from .core.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Excavaciones Maella - CMS API",
    description="API completa para gestión de contenido CMS, servicios, proyectos y contacto",
    version="2.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite acceso desde cualquier IP en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication and user management routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(roles.router, prefix="/api/roles", tags=["Roles"])
app.include_router(permissions.router, prefix="/api/permissions", tags=["Permissions"])
app.include_router(audit_logs.router, prefix="/api/audit-logs", tags=["Audit Logs"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])

# Include CMS routers
app.include_router(cms_pages.router, prefix="/api/cms/pages", tags=["CMS Pages"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(
    testimonials.router, prefix="/api/testimonials", tags=["Testimonials"]
)
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(
    site_config.router, prefix="/api/site-config", tags=["Site Configuration"]
)
app.include_router(hero_images.router, prefix="/api/hero-images", tags=["Hero Images"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])


@app.get("/")
def root():
    return {
        "message": "Excavaciones Maella - CMS API",
        "version": "2.0.0",
        "docs": "/docs",
    }


# Create uploads directory structure if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
(uploads_dir / "hero").mkdir(exist_ok=True)
(uploads_dir / "services").mkdir(exist_ok=True)
(uploads_dir / "projects").mkdir(exist_ok=True)

# Mount static files AFTER all routers to avoid conflicts
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
