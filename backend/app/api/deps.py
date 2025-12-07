from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.security import decode_access_token
from ..models.user import User
from ..services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: Optional[str] = payload.get("sub")
    if username is None:
        raise credentials_exception

    user = UserService.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Verificar que el usuario es administrador o superusuario."""
    if current_user.is_superuser:
        return current_user
    
    # Verificar si tiene rol de Administrador
    admin_roles = ["Administrador", "Admin"]
    if any(role.name in admin_roles for role in current_user.roles):
        return current_user
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No tiene permisos de administrador"
    )


def check_permission(resource: str, action: str):
    """Dependencia para verificar permisos específicos.
    
    Permite acceso si:
    1. El usuario es superusuario (is_superuser=True)
    2. El usuario tiene rol Administrador
    3. El usuario tiene el permiso específico (resource.action)
    
    Args:
        resource: Recurso (ej: 'cms_pages', 'services', 'projects')
        action: Acción (ej: 'create', 'read', 'update', 'delete')
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
        
        # Buscar en los roles del usuario
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
