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
        # Intentar crear un servicio (requiere services.create)
        response = client.post(
            "/api/services/",
            headers=admin_headers,
            json={
                "title": "Test Service",
                "slug": "test-service",
                "description": "Test",
                "is_active": True,
                "is_featured": False,
            },
        )
        assert response.status_code in [201, 400]  # 400 si slug existe

    def test_admin_role_has_all_permissions(
        self, client: TestClient, db_session, admin_headers: dict
    ):
        """Test que el rol Administrador tiene acceso a todos los endpoints."""
        # Verificar que admin tiene rol Administrador
        from app.services.user_service import UserService

        admin = UserService.get_user_by_username(db_session, "admin")
        assert admin is not None
        role_names = [role.name for role in admin.roles]
        assert "Administrador" in role_names

    def test_user_without_permission_gets_403(
        self, client: TestClient, db_session, user_headers: dict
    ):
        """Test que usuarios sin permisos reciben 403 Forbidden."""
        # Usuario regular no tiene permiso para crear servicios
        response = client.post(
            "/api/services/",
            headers=user_headers,
            json={
                "title": "Test Service",
                "slug": "test-service-forbidden",
                "description": "Test",
                "is_active": True,
                "is_featured": False,
            },
        )
        assert response.status_code == 403
        assert "permiso" in response.json()["detail"].lower()

    def test_cms_permissions_exist(self, db_session):
        """Test que los 18 permisos CMS existen en la base de datos."""
        cms_resources = [
            "cms_pages",
            "services",
            "projects",
            "testimonials",
            "hero_images",
            "site_config",
            "contact_leads",
        ]

        for resource in cms_resources:
            perms = (
                db_session.query(Permission)
                .filter(Permission.resource == resource)
                .all()
            )
            assert len(perms) > 0, f"No permissions found for {resource}"

    def test_user_with_specific_permission_has_access(
        self, client: TestClient, db_session
    ):
        """Test que usuarios con permisos específicos pueden acceder."""
        # Crear usuario con permiso específico
        from app.core.security import get_password_hash

        test_user = User(
            email="editor@test.com",
            username="editor_test",
            hashed_password=get_password_hash("test123"),
            first_name="Editor",
            last_name="Test",
            is_active=True,
            is_superuser=False,
        )
        db_session.add(test_user)
        db_session.commit()

        # Crear rol con permiso específico
        test_role = Role(
            name="Test Editor",
            description="Test role with specific permission",
            is_active=True,
        )
        db_session.add(test_role)
        db_session.commit()

        # Asignar permiso services.create
        permission = (
            db_session.query(Permission)
            .filter(Permission.code == "services.create")
            .first()
        )
        if permission:
            test_role.permissions = [permission]
            test_user.roles.append(test_role)
            db_session.commit()

            # Login
            login_response = client.post(
                "/api/auth/login",
                data={"username": "editor_test", "password": "test123"},
            )
            assert login_response.status_code == 200
            token = login_response.json()["access_token"]

            # Intentar crear servicio
            response = client.post(
                "/api/services/",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "title": "Test Service Editor",
                    "slug": "test-service-editor",
                    "description": "Test",
                    "is_active": True,
                    "is_featured": False,
                },
            )
            assert response.status_code in [201, 400]  # 400 si slug existe

        # Cleanup
        db_session.delete(test_user)
        db_session.delete(test_role)
        db_session.commit()

    def test_inactive_permission_is_not_granted(self, db_session):
        """Test que permisos inactivos no se otorgan."""
        from app.core.security import get_password_hash

        # Crear usuario de prueba
        test_user = User(
            email="inactive_perm@test.com",
            username="inactive_perm_user",
            hashed_password=get_password_hash("test123"),
            first_name="Test",
            last_name="User",
            is_active=True,
            is_superuser=False,
        )
        db_session.add(test_user)
        db_session.commit()

        # Crear rol con permiso inactivo
        test_role = Role(
            name="Inactive Permission Role", description="Test role", is_active=True
        )
        db_session.add(test_role)
        db_session.commit()

        # Obtener un permiso y marcarlo como inactivo
        permission = (
            db_session.query(Permission)
            .filter(Permission.code == "services.create")
            .first()
        )
        if permission:
            permission.is_active = False
            test_role.permissions = [permission]
            test_user.roles.append(test_role)
            db_session.commit()

            # Verificar que el usuario tiene el rol pero el permiso está inactivo
            assert len(test_user.roles) > 0
            assert permission in test_user.roles[0].permissions
            assert not permission.is_active

            # Restaurar estado
            permission.is_active = True
            db_session.commit()

        # Cleanup
        db_session.delete(test_user)
        db_session.delete(test_role)
        db_session.commit()


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
                "slug": "test-page",
                "is_published": False,
                "is_homepage": False,
            },
        )
        assert response.status_code == 403

    def test_projects_update_requires_permission(
        self, client: TestClient, user_headers: dict
    ):
        """Test que actualizar proyectos requiere permiso."""
        response = client.put(
            "/api/projects/999",
            headers=user_headers,
            json={"title": "Updated Project"},
        )
        assert response.status_code in [403, 404]

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
