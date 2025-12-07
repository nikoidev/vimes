"""
Tests para el sistema de permisos granulares y autorización RBAC
"""

import pytest
from fastapi.testclient import TestClient

from app.models.permission import Permission
from app.models.role import Role
from app.models.user import User


@pytest.mark.permissions
class TestPermissionSystem:
    """Test del sistema de permisos granulares."""

    def test_superuser_has_all_permissions(
        self, client: TestClient, admin_headers: dict
    ):
        """Test que superusuarios tienen acceso a todos los endpoints CMS."""
        # Admin puede leer permisos
        response = client.get("/api/permissions/", headers=admin_headers)
        assert response.status_code == 200

    def test_admin_role_has_all_permissions(self, client: TestClient):
        """Test que el rol Administrador tiene acceso a todos los endpoints."""
        # Login como admin
        response = client.post(
            "/api/auth/login", data={"username": "admin", "password": "admin123"}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_user_without_permission_gets_403(
        self, client: TestClient, user_headers: dict
    ):
        """Test que usuarios sin permisos reciben 403 Forbidden."""
        # Usuario regular no tiene permiso para crear servicios
        response = client.post(
            "/api/services/",
            headers=user_headers,
            json={
                "title": "Test Service",
                "slug": "test-service-forbidden-new",
                "description": "Test",
                "is_active": True,
                "is_featured": False,
            },
        )
        assert response.status_code == 403
        assert "permiso" in response.json()["detail"].lower()

    def test_cms_permissions_exist(self, test_db):
        """Test que los permisos CMS existen en la base de datos."""
        from sqlalchemy.orm import Session

        db: Session = test_db

        cms_codes = [
            "cms_pages.create",
            "services.create",
            "projects.create",
            "testimonials.create",
        ]

        for code in cms_codes:
            perm = db.query(Permission).filter(Permission.code == code).first()
            assert perm is not None, f"Permission {code} not found"


@pytest.mark.cms
class TestCMSEndpointsPermissions:
    """Test de permisos en endpoints CMS."""

    def test_cms_pages_create_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que crear páginas CMS requiere permiso."""
        response = client.post(
            "/api/cms/pages/",
            headers=user_headers,
            json={
                "title": "Test Page",
                "slug": "test-page-forbidden",
                "is_published": False,
                "is_homepage": False,
            },
        )
        assert response.status_code == 403

    def test_testimonials_delete_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que eliminar testimonios requiere permiso."""
        response = client.delete("/api/testimonials/999", headers=user_headers)
        assert response.status_code in [403, 404]

    def test_hero_images_create_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que crear imágenes hero requiere permiso."""
        response = client.post(
            "/api/hero-images/",
            headers=user_headers,
            json={
                "title": "Test Image",
                "image_url": "http://example.com/image.jpg",
                "is_active": True,
            },
        )
        assert response.status_code == 403

    def test_site_config_update_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que actualizar configuración requiere permiso."""
        response = client.put(
            "/api/site-config/", headers=user_headers, json={"company_name": "Test"}
        )
        assert response.status_code == 403

    def test_contact_leads_manage_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que gestionar leads requiere permiso."""
        response = client.get("/api/contact/", headers=user_headers)
        assert response.status_code == 403
