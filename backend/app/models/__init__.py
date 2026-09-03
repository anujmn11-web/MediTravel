from app.models.location import Location
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.appointment import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord

# Expose Base here or import them in base for Alembic
__all__ = [
    "Location",
    "Patient",
    "Hospital",
    "Doctor",
    "Appointment",
    "AppointmentStatus",
    "MedicalRecord",
]
