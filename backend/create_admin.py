"""
Script para crear usuario administrador inicial
"""
import sys
from pathlib import Path

# Añadir el directorio backend al path
sys.path.append(str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission


def create_admin_user():
    """Crear usuario administrador con todos los permisos"""
    db = SessionLocal()
    
    try:
        # Verificar si ya existe el usuario admin
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("⚠️  El usuario 'admin' ya existe")
            print(f"   Email: {existing_user.email}")
            print(f"   Username: {existing_user.username}")
            
            # Actualizar la contraseña por si acaso
            existing_user.hashed_password = get_password_hash("admin123")
            db.commit()
            print("✅ Contraseña actualizada a: admin123")
            return
        
        # Crear o obtener el rol de administrador
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        if not admin_role:
            print("📝 Creando rol Admin...")
            admin_role = Role(
                name="Admin",
                description="Administrador con todos los permisos",
                is_active=True
            )
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)
            
            # Asignar todos los permisos al rol Admin
            all_permissions = db.query(Permission).all()
            if all_permissions:
                admin_role.permissions = all_permissions
                db.commit()
                print(f"✅ Rol Admin creado con {len(all_permissions)} permisos")
        
        # Crear usuario admin
        print("👤 Creando usuario admin...")
        admin_user = User(
            email="admin@excavacionesmaella.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="Sistema",
            is_active=True,
            is_superuser=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        # Asignar rol al usuario
        admin_user.roles.append(admin_role)
        db.commit()
        
        print("\n✅ Usuario administrador creado exitosamente!")
        print("\n📋 Credenciales de acceso:")
        print("   Email:    admin@excavacionesmaella.com")
        print("   Username: admin")
        print("   Password: admin123")
        print("\n🔗 Accede en: http://localhost:3000/login")
        
    except Exception as e:
        print(f"\n❌ Error al crear usuario: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("\n🔐 Creando usuario administrador...\n")
    create_admin_user()
