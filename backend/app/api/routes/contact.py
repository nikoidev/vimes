from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import check_permission, get_db
from app.models.contact_lead import LeadStatus
from app.models.user import User
from app.schemas.contact_lead import ContactLead, ContactLeadCreate, ContactLeadUpdate
from app.services.contact_lead_service import ContactLeadService

router = APIRouter()


@router.post("/", response_model=ContactLead, status_code=201)
def create_contact_lead(
    lead: ContactLeadCreate, request: Request, db: Session = Depends(get_db)
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
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Obtener todos los leads (requiere permiso contact_leads.manage)"""
    return ContactLeadService.get_leads(db, skip, limit, status, unread_only)


@router.get("/unread-count", response_model=dict)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Obtener el número de leads no leídos (requiere permiso contact_leads.manage)"""
    count = ContactLeadService.get_unread_count(db)
    return {"count": count}


@router.get("/{lead_id}", response_model=ContactLead)
def get_contact_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Obtener un lead por ID (requiere permiso contact_leads.manage)"""
    lead = ContactLeadService.get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return lead


@router.put("/{lead_id}", response_model=ContactLead)
def update_contact_lead(
    lead_id: int,
    lead: ContactLeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Actualizar un lead (requiere permiso contact_leads.manage)"""
    db_lead = ContactLeadService.update_lead(db, lead_id, lead)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return db_lead


@router.patch("/{lead_id}/read", response_model=ContactLead)
def mark_lead_as_read(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Marcar un lead como leído (requiere permiso contact_leads.manage)"""
    db_lead = ContactLeadService.mark_as_read(db, lead_id)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return db_lead


@router.delete("/{lead_id}", status_code=204)
def delete_contact_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_permission("contact_leads", "manage")),
):
    """Eliminar un lead (requiere permiso contact_leads.manage)"""
    if not ContactLeadService.delete_lead(db, lead_id):
        raise HTTPException(status_code=404, detail="Lead no encontrado")
