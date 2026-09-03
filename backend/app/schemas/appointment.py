from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.appointment import AppointmentStatus

class AppointmentBase(BaseModel):
    doctor_id: int
    hospital_id: Optional[int] = None
    scheduled_at: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentOut(AppointmentBase):
    id: int
    patient_id: int
    status: AppointmentStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
