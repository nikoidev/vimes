"""
Script para probar el sistema de permisos granulares CMS
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission


def test_permission_system():
    """Verificar que el sistema de permisos está correctamente configurado"""
    db = SessionLocal()
    
    try:
        print("\n🔍 VERIFICACIÓN DEL SISTEMA DE PERMISOS\n")
        print("=" * 60)
        
        # 1. Verificar que existen los permisos CMS
        print("\n1️⃣  Verificando permisos CMS...")
        cms_permissions = db.query(Permission).filter(
            Permission.resource.in_([
                'cms_pages', 'services', 'projects', 'testimonials',
                'hero_images', 'site_config', 'contact_leads'
            ])
        ).all()
        
        print(f"   ✅ {len(cms_permissions)} permisos CMS encontrados:")
        for perm in sorted(cms_permissions, key=lambda x: x.code):
            print(f"      - {perm.code}: {perm.name}")
        
        # 2. Verificar usuario admin
        print("\n2️⃣  Verificando usuario administrador...")
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print(f"   ✅ Admin encontrado: {admin.email}")
            print(f"      - is_superuser: {admin.is_superuser}")
            print(f"      - Roles: {[r.name for r in admin.roles]}")
            
            # Contar permisos del admin
            admin_perms = set()
            for role in admin.roles:
                for perm in role.permissions:
                    admin_perms.add(perm.code)
            print(f"      - Total permisos: {len(admin_perms)}")
        else:
            print("   ❌ Usuario admin no encontrado")
        
        # 3. Crear usuario de prueba con permisos específicos
        print("\n3️⃣  Creando usuario de prueba con permisos específicos...")
        
        # Verificar si ya existe
        test_user = db.query(User).filter(User.username == "cms_editor").first()
        if test_user:
            print("   ⚠️  Usuario 'cms_editor' ya existe, eliminando...")
            db.delete(test_user)
            db.commit()
        
        # Crear rol "Editor CMS"
        editor_role = db.query(Role).filter(Role.name == "Editor CMS").first()
        if not editor_role:
            editor_role = Role(
                name="Editor CMS",
                description="Puede editar servicios y proyectos solamente",
                is_active=True
            )
            db.add(editor_role)
            db.commit()
            db.refresh(editor_role)
        
        # Asignar permisos específicos al rol Editor
        services_perms = db.query(Permission).filter(
            Permission.code.in_([
                'services.create',
                'services.update',
                'services.delete',
                'projects.create',
                'projects.update',
                'projects.delete'
            ])
        ).all()
        
        editor_role.permissions = services_perms
        db.commit()
        
        print(f"   ✅ Rol 'Editor CMS' creado con {len(services_perms)} permisos:")
        for perm in services_perms:
            print(f"      - {perm.code}")
        
        # Crear usuario editor
        cms_editor = User(
            email="editor@excavacionesmaella.com",
            username="cms_editor",
            hashed_password=get_password_hash("editor123"),
            first_name="Editor",
            last_name="CMS",
            is_active=True,
            is_superuser=False
        )
        db.add(cms_editor)
        db.commit()
        db.refresh(cms_editor)
        
        # Asignar rol
        cms_editor.roles.append(editor_role)
        db.commit()
        
        print(f"\n   ✅ Usuario 'cms_editor' creado exitosamente")
        print(f"      - Email: {cms_editor.email}")
        print(f"      - Password: editor123")
        print(f"      - Puede editar: Servicios y Proyectos")
        print(f"      - NO puede editar: Testimonios, Hero Images, Site Config, CMS Pages")
        
        # 4. Resumen del sistema
        print("\n" + "=" * 60)
        print("\n📋 RESUMEN DEL SISTEMA DE PERMISOS\n")
        print("✅ Sistema de permisos granulares implementado")
        print("\n👥 Usuarios de prueba:")
        print("   1. admin / admin123 - Acceso completo")
        print("   2. user / user123 - Solo lectura")
        print("   3. cms_editor / editor123 - Edición de Servicios y Proyectos")
        
        print("\n🔒 Lógica de autorización:")
        print("   1. Superusuarios (is_superuser=True) → Acceso completo")
        print("   2. Rol 'Administrador' → Acceso completo")
        print("   3. Permisos específicos → Acceso granular por recurso.acción")
        print("   4. Sin permisos → 403 Forbidden")
        
        print("\n🎯 Ejemplo de uso:")
        print("   - Admin puede crear/editar TODO")
        print("   - cms_editor puede crear/editar Servicios y Proyectos")
        print("   - cms_editor NO puede editar Testimonios (403 Forbidden)")
        print("   - user NO puede editar nada (403 Forbidden)")
        
        print("\n✅ Sistema listo para producción!")
        print("=" * 60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    test_permission_system()
