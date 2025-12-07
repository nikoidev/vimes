"""
Tests para el sistema de permisos granulares y autorización RBAC
"""

import pytest
from fastapi.testclient import TestClient

from app.models.permission import Permission


@pytest.mark.permissions
class TestPermissionSystem:
    """Test del sistema de permisos granulares."""

    def test_admin_can_access_permissions(
        self, client: TestClient, admin_headers: dict
    ):
        """Test que admin puede acceder a endpoints protegidos."""
        response = client.get("/api/permissions/", headers=admin_headers)
        assert response.status_code == 200

    def test_admin_can_create_service(self, client: TestClient, admin_headers: dict):
        """Test que admin puede crear servicios."""
        response = client.post(
            "/api/services/",
            headers=admin_headers,
            json={
                "title": "Admin Test Service",
                "slug": "admin-test-service-unique",
                "description": "Test by admin",
                "is_active": True,
                "is_featured": False,
            },
        )
        assert response.status_code in [201, 400]

    def test_user_without_permission_gets_403(
        self, client: TestClient, user_headers: dict
    ):
        """Test que usuarios sin permisos reciben 403 Forbidden."""
        response = client.post(
            "/api/services/",
            headers=user_headers,
            json={
                "title": "User Test Service",
                "slug": "user-test-service-forbidden",
                "description": "Test",
                "is_active": True,
                "is_featured": False,
            },
        )
        assert response.status_code == 403

    def test_cms_permissions_exist(self, client: TestClient, admin_headers: dict):
        """Test que los permisos CMS clave existen."""
        # Verificar a través del API
        response = client.get("/api/permissions/?limit=100", headers=admin_headers)
        assert response.status_code == 200
        
        permissions = response.json()["items"]
        permission_codes = [p["code"] for p in permissions]
        
        # Verificar que existen permisos CMS clave
        assert "cms_pages.create" in permission_codes
        assert "services.create" in permission_codes
        assert "projects.create" in permission_codes
        assert "testimonials.create" in permission_codes


@pytest.mark.cms
class TestCMSEndpointsPermissions:
    """Test de permisos en endpoints CMS."""

    def test_cms_pages_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que crear páginas requiere permiso."""
        response = client.post(
            "/api/cms/pages/",
            headers=user_headers,
            json={
                "title": "Test",
                "slug": "test-forbidden-page",
                "is_published": False,
                "is_homepage": False,
            },
        )
        assert response.status_code == 403

    def test_projects_requires_permission(self, client: TestClient, user_headers: dict):
        """Test que crear proyectos requiere permiso."""
        response = client.post(
            "/api/projects/",
            headers=user_headers,
            json={
                "title": "Test",
                "slug": "test-forbidden-project",
                "description": "Test",
                "is_published": False,
            },
        )
        assert response.status_code == 403

    def test_testimonials_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que crear testimonios requiere permiso."""
        response = client.post(
            "/api/testimonials/",
            headers=user_headers,
            json={
                "client_name": "Test",
                "position": "Test",
                "testimonial_text": "Test",
                "rating": 5,
                "is_published": False,
            },
        )
        assert response.status_code == 403

    def test_hero_images_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que crear hero images requiere permiso."""
        response = client.post(
            "/api/hero-images/",
            headers=user_headers,
            json={
                "title": "Test",
                "image_url": "http://test.com/img.jpg",
                "is_active": True,
            },
        )
        assert response.status_code == 403

    def test_site_config_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que actualizar config requiere permiso."""
        response = client.put(
            "/api/site-config/", headers=user_headers, json={"company_name": "Test"}
        )
        assert response.status_code == 403

    def test_contact_leads_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que gestionar leads requiere permiso."""
        response = client.get("/api/contact/", headers=user_headers)
        assert response.status_code == 403
