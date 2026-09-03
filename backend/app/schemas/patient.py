from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class PatientBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location_id: Optional[int] = None

class PatientCreate(PatientBase):
    password: str

class PatientOut(PatientBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ── JWT Token Schemas ─────────────────────────────────────────────────────────
class Token(BaseModel):
    """Returned by POST /api/patients/login."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Internal use: data decoded from a JWT payload."""
    email: Optional[str] = None

