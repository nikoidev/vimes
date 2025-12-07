from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.contact_lead import ContactLead, LeadStatus
from app.schemas.contact_lead import ContactLeadCreate, ContactLeadUpdate


class ContactLeadService:
    @staticmethod
    def get_lead(db: Session, lead_id: int) -> Optional[ContactLead]:
        """Obtener un lead por ID"""
        return db.query(ContactLead).filter(ContactLead.id == lead_id).first()

    @staticmethod
    def get_leads(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: Optional[LeadStatus] = None,
        unread_only: bool = False,
    ) -> List[ContactLead]:
        """Obtener todos los leads"""
        query = db.query(ContactLead).filter(ContactLead.is_spam == False)
        if status:
            query = query.filter(ContactLead.status == status)
        if unread_only:
            query = query.filter(ContactLead.is_read == False)
        return (
            query.order_by(ContactLead.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create_lead(
        db: Session,
        lead: ContactLeadCreate,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        referrer: Optional[str] = None,
    ) -> ContactLead:
        """Crear un nuevo lead"""
        db_lead = ContactLead(
            **lead.model_dump(),
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
        )
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        return db_lead

    @staticmethod
    def update_lead(
        db: Session, lead_id: int, lead: ContactLeadUpdate
    ) -> Optional[ContactLead]:
        """Actualizar un lead existente"""
        db_lead = db.query(ContactLead).filter(ContactLead.id == lead_id).first()
        if not db_lead:
            return None

        update_data = lead.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_lead, field, value)

        db.commit()
        db.refresh(db_lead)
        return db_lead

    @staticmethod
    def mark_as_read(db: Session, lead_id: int) -> Optional[ContactLead]:
        """Marcar un lead como leído"""
        db_lead = db.query(ContactLead).filter(ContactLead.id == lead_id).first()
        if not db_lead:
            return None

        db_lead.is_read = True
        db.commit()
        db.refresh(db_lead)
        return db_lead

    @staticmethod
    def delete_lead(db: Session, lead_id: int) -> bool:
        """Eliminar un lead"""
        db_lead = db.query(ContactLead).filter(ContactLead.id == lead_id).first()
        if not db_lead:
            return False

        db.delete(db_lead)
        db.commit()
        return True

    @staticmethod
    def get_unread_count(db: Session) -> int:
        """Obtener el número de leads no leídos"""
        return (
            db.query(ContactLead)
            .filter(ContactLead.is_read == False, ContactLead.is_spam == False)
            .count()
        )
