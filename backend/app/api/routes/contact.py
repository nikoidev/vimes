from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.contact_lead import LeadStatus
from app.schemas.contact_lead import ContactLead, ContactLeadCreate, ContactLeadUpdate
from app.services.contact_lead_service import ContactLeadService

router = APIRouter()


@router.post("/", response_model=ContactLead, status_code=201)
def create_contact_lead(
    lead: ContactLeadCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Crear un nuevo lead de contacto (público - formulario de contacto)"""
    # Obtener información de la petición
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referrer = request.headers.get("referer")
    
    return ContactLeadService.create_lead(db, lead, ip_address, user_agent, referrer)


@router.get("/", response_model=List[ContactLead])
def get_contact_leads(
    skip: int = 0,
    limit: int = 100,
    status: Optional[LeadStatus] = None,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener todos los leads (requiere autenticación)"""
    return ContactLeadService.get_leads(db, skip, limit, status, unread_only)


@router.get("/unread-count", response_model=dict)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener el número de leads no leídos (requiere autenticación)"""
    count = ContactLeadService.get_unread_count(db)
    return {"count": count}


@router.get("/{lead_id}", response_model=ContactLead)
def get_contact_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener un lead por ID (requiere autenticación)"""
    lead = ContactLeadService.get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return lead


@router.put("/{lead_id}", response_model=ContactLead)
def update_contact_lead(
    lead_id: int,
    lead: ContactLeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar un lead (requiere autenticación)"""
    db_lead = ContactLeadService.update_lead(db, lead_id, lead)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return db_lead


@router.patch("/{lead_id}/read", response_model=ContactLead)
def mark_lead_as_read(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Marcar un lead como leído (requiere autenticación)"""
    db_lead = ContactLeadService.mark_as_read(db, lead_id)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return db_lead


@router.delete("/{lead_id}", status_code=204)
def delete_contact_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un lead (requiere autenticación)"""
    if not ContactLeadService.delete_lead(db, lead_id):
        raise HTTPException(status_code=404, detail="Lead no encontrado")
