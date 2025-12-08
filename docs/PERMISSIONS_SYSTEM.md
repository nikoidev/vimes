# 🔒 Sistema de Permisos Granulares - Excavaciones Maella CMS

## 📋 Resumen

Se ha implementado un **sistema de control de acceso basado en roles (RBAC)** con permisos granulares para el CMS de Excavaciones Maella. Este sistema permite al administrador asignar permisos específicos a usuarios individuales para controlar exactamente qué pueden modificar en el sitio web.

---

## 🎯 Características Principales

### 1. **Tres Niveles de Autorización**

1. **Superusuarios** (`is_superuser=True`)
   - Acceso completo a toda la aplicación
   - Bypasean todas las verificaciones de permisos
   - Usuario admin por defecto tiene esta bandera

2. **Rol Administrador**
   - Usuarios con el rol "Administrador" o "Admin"
   - Acceso completo a todas las funcionalidades CMS
   - Pueden gestionar usuarios, roles y permisos

3. **Permisos Específicos**
   - Permisos granulares por recurso y acción
   - Formato: `recurso.acción` (ej: `services.create`, `projects.update`)
   - Asignables a usuarios individuales a través de roles personalizados

---

## 🔐 Permisos CMS Disponibles

### **Páginas CMS** (`cms_pages`)
- `cms_pages.create` - Crear nuevas páginas
- `cms_pages.read` - Leer páginas
- `cms_pages.update` - Actualizar páginas existentes
- `cms_pages.delete` - Eliminar páginas

### **Servicios** (`services`)
- `services.create` - Crear servicios
- `services.update` - Actualizar servicios
- `services.delete` - Eliminar servicios

### **Proyectos** (`projects`)
- `projects.create` - Crear proyectos
- `projects.update` - Actualizar proyectos
- `projects.delete` - Eliminar proyectos

### **Testimonios** (`testimonials`)
- `testimonials.create` - Crear testimonios
- `testimonials.update` - Actualizar testimonios
- `testimonials.delete` - Eliminar testimonios

### **Galería Hero** (`hero_images`)
- `hero_images.create` - Subir imágenes
- `hero_images.update` - Actualizar imágenes
- `hero_images.delete` - Eliminar imágenes

### **Configuración del Sitio** (`site_config`)
- `site_config.update` - Modificar configuración general

### **Leads de Contacto** (`contact_leads`)
- `contact_leads.manage` - Gestionar mensajes de contacto

---

## 👥 Usuarios de Prueba Creados

### 1. **Administrador**
```
Usuario: admin
Password: admin123
Email: admin@example.com
Permisos: TODOS (acceso completo)
```

### 2. **Usuario Regular**
```
Usuario: user
Password: user123
Email: user@example.com
Permisos: Solo lectura (no puede modificar nada)
```

### 3. **Editor CMS** (Usuario de ejemplo)
```
Usuario: cms_editor
Password: editor123
Email: editor@excavacionesmaella.com
Permisos: Puede editar Servicios y Proyectos únicamente
```

---

## 🛠️ Cómo Asignar Permisos a Usuarios

### **Opción 1: Desde la Interfaz Web**

1. **Iniciar sesión como admin**
   ```
   URL: http://localhost:3000/login
   Usuario: admin
   Password: admin123
   ```

2. **Ir a la sección de Roles**
   ```
   Panel lateral → Roles
   ```

3. **Crear un nuevo rol personalizado**
   - Clic en "Nuevo Rol"
   - Nombre: "Editor de Servicios" (ejemplo)
   - Descripción: "Puede crear y editar servicios"
   - Seleccionar permisos:
     - ✅ services.create
     - ✅ services.update
     - ✅ services.delete

4. **Asignar el rol a un usuario**
   ```
   Panel lateral → Usuarios
   → Seleccionar usuario
   → Editar
   → En "Roles" seleccionar el rol creado
   → Guardar
   ```

### **Opción 2: Mediante Script Python**

```python
from app.core.database import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission

db = SessionLocal()

# 1. Crear un rol personalizado
custom_role = Role(
    name="Gestor de Proyectos",
    description="Puede gestionar proyectos y testimonios",
    is_active=True
)
db.add(custom_role)
db.commit()

# 2. Asignar permisos al rol
permissions = db.query(Permission).filter(
    Permission.code.in_([
        'projects.create',
        'projects.update',
        'projects.delete',
        'testimonials.create',
        'testimonials.update',
        'testimonials.delete'
    ])
).all()

custom_role.permissions = permissions
db.commit()

# 3. Asignar rol al usuario
user = db.query(User).filter(User.username == "maria").first()
user.roles.append(custom_role)
db.commit()

print(f"✅ Rol '{custom_role.name}' asignado a {user.username}")
db.close()
```

---

## 🔍 Ejemplos de Casos de Uso

### **Caso 1: Editor de Contenido**
**Necesidad:** Usuario que solo puede editar servicios y proyectos.

**Permisos requeridos:**
- `services.create`
- `services.update`
- `services.delete`
- `projects.create`
- `projects.update`
- `projects.delete`

**Resultado:** Puede crear, editar y eliminar servicios y proyectos. NO puede modificar testimonios, galería hero, configuración del sitio ni páginas CMS.

---

### **Caso 2: Gestor de Galería**
**Necesidad:** Usuario que solo gestiona las imágenes del hero.

**Permisos requeridos:**
- `hero_images.create`
- `hero_images.update`
- `hero_images.delete`

**Resultado:** Solo puede subir, editar y eliminar imágenes de la galería hero. No tiene acceso a ningún otro contenido.

---

### **Caso 3: Community Manager**
**Necesidad:** Usuario que gestiona testimonios y responde contactos.

**Permisos requeridos:**
- `testimonials.create`
- `testimonials.update`
- `testimonials.delete`
- `contact_leads.manage`

**Resultado:** Puede gestionar testimonios de clientes y responder a mensajes de contacto. No puede modificar servicios, proyectos ni configuración.

---

## 🚫 Respuestas de Error

### **403 Forbidden - Sin Permisos**
```json
{
  "detail": "No tiene permiso para create en services"
}
```

**Causa:** El usuario no tiene el permiso específico requerido.

**Solución:** 
1. Admin debe asignar el permiso necesario al usuario
2. O asignar un rol que incluya ese permiso

### **401 Unauthorized**
```json
{
  "detail": "Could not validate credentials"
}
```

**Causa:** Token JWT inválido o expirado.

**Solución:** Iniciar sesión nuevamente.

---

## 📊 Endpoints Protegidos

### Todos los endpoints CMS de modificación requieren permisos:

| Endpoint | Método | Permiso Requerido |
|----------|--------|-------------------|
| `/api/cms/pages/` | POST | `cms_pages.create` |
| `/api/cms/pages/{id}` | PUT | `cms_pages.update` |
| `/api/cms/pages/{id}` | DELETE | `cms_pages.delete` |
| `/api/services/` | POST | `services.create` |
| `/api/services/{id}` | PUT | `services.update` |
| `/api/services/{id}` | DELETE | `services.delete` |
| `/api/projects/` | POST | `projects.create` |
| `/api/projects/{id}` | PUT | `projects.update` |
| `/api/projects/{id}` | DELETE | `projects.delete` |
| `/api/testimonials/` | POST | `testimonials.create` |
| `/api/testimonials/{id}` | PUT | `testimonials.update` |
| `/api/testimonials/{id}` | DELETE | `testimonials.delete` |
| `/api/hero-images/` | POST | `hero_images.create` |
| `/api/hero-images/{id}` | PUT | `hero_images.update` |
| `/api/hero-images/{id}` | DELETE | `hero_images.delete` |
| `/api/site-config/` | PUT | `site_config.update` |
| `/api/contact/*` | * | `contact_leads.manage` |

**Nota:** Los endpoints GET (lectura) son públicos y no requieren permisos.

---

## 🔧 Arquitectura Técnica

### **Implementación en `backend/app/api/deps.py`**

```python
def check_permission(resource: str, action: str):
    """Dependencia para verificar permisos específicos.
    
    Permite acceso si:
    1. El usuario es superusuario (is_superuser=True)
    2. El usuario tiene rol Administrador
    3. El usuario tiene el permiso específico (resource.action)
    """
    def _check_permission(current_user: User = Depends(get_current_active_user)) -> User:
        # Superusuario tiene todos los permisos
        if current_user.is_superuser:
            return current_user
        
        # Administrador tiene todos los permisos
        admin_roles = ["Administrador", "Admin"]
        if any(role.name in admin_roles for role in current_user.roles):
            return current_user
        
        # Verificar permiso específico
        required_code = f"{resource}.{action}"
        
        for role in current_user.roles:
            if not role.is_active:
                continue
            for permission in role.permissions:
                if permission.is_active and permission.code == required_code:
                    return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"No tiene permiso para {action} en {resource}"
        )
    
    return _check_permission
```

### **Uso en Rutas**

```python
# Antes (solo autenticación)
@router.post("/")
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    ...

# Ahora (autenticación + autorización)
@router.post("/")
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("services", "create")),
):
    ...
```

---

## ✅ Testing

### **Verificar que el sistema funciona correctamente:**

```bash
# Ejecutar script de verificación
cd backend
python test_permissions.py
```

**Salida esperada:**
```
🔍 VERIFICACIÓN DEL SISTEMA DE PERMISOS
============================================================
1️⃣  Verificando permisos CMS...
   ✅ 18 permisos CMS encontrados
2️⃣  Verificando usuario administrador...
   ✅ Admin encontrado: admin@example.com
3️⃣  Creando usuario de prueba con permisos específicos...
   ✅ Usuario 'cms_editor' creado exitosamente
✅ Sistema listo para producción!
============================================================
```

---

## 📝 Notas Importantes

1. **Lecturas son Públicas:** Todos los endpoints GET (consulta) son públicos y NO requieren autenticación. Esto permite que el sitio web público muestre el contenido.

2. **Modificaciones Requieren Permisos:** Todos los endpoints POST, PUT, DELETE requieren permisos específicos o rol de administrador.

3. **Admin Siempre Tiene Acceso:** Usuarios con `is_superuser=True` o rol "Administrador" bypasean todas las verificaciones y tienen acceso completo.

4. **Roles son Reutilizables:** Puedes crear roles personalizados y asignarlos a múltiples usuarios. Esto facilita la gestión cuando tienes varios usuarios con las mismas responsabilidades.

5. **Permisos se Acumulan:** Si un usuario tiene múltiples roles, los permisos se acumulan. Por ejemplo, si tiene un rol con `services.create` y otro con `projects.create`, tendrá ambos permisos.

---

## 🎓 Mejores Prácticas

1. **Principio de Mínimo Privilegio:** Asigna solo los permisos necesarios para que cada usuario realice su trabajo.

2. **Usa Roles, no Permisos Individuales:** En lugar de asignar permisos uno por uno, crea roles con conjuntos de permisos lógicos.

3. **Nombres Descriptivos:** Usa nombres claros para roles (ej: "Editor de Servicios", "Gestor de Galería") para facilitar la gestión.

4. **Revisa Periódicamente:** Audita regularmente qué usuarios tienen qué permisos y revoca los que ya no sean necesarios.

5. **Documenta Roles Personalizados:** Mantén un registro de qué roles has creado y para qué propósito.

---

## 🆘 Soporte

Si tienes dudas sobre cómo asignar permisos o crear roles personalizados, contacta al equipo de desarrollo o consulta este documento.

**Última actualización:** Diciembre 2025
**Versión del sistema:** 2.0.0
