from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.contact_lead import LeadStatus


class ContactLeadBase(BaseModel):
    name: str = Field(..., max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    company: Optional[str] = Field(None, max_length=200)
    location: Optional[str] = Field(None, max_length=300)
    subject: Optional[str] = Field(None, max_length=300)
    message: str
    service_interest: Optional[str] = Field(None, max_length=200)


class ContactLeadCreate(ContactLeadBase):
    pass


class ContactLeadUpdate(BaseModel):
    status: Optional[LeadStatus] = None
    notes: Optional[str] = None
    assigned_to: Optional[int] = None
    is_read: Optional[bool] = None
    is_spam: Optional[bool] = None


class ContactLead(ContactLeadBase):
    id: int
    status: LeadStatus
    notes: Optional[str] = None
    assigned_to: Optional[int] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    is_read: bool
    is_spam: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
