from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class MedicalRecordBase(BaseModel):
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    history_notes: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordOut(MedicalRecordBase):
    id: int
    patient_id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
