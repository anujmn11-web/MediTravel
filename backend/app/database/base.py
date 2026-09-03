# Import Base and all models so they are registered with Base.metadata
# This file is used by Alembic to find the DB metadata for migrations

from app.database.base_class import Base
from app.models.location import Location
from app.models.patient import Patient
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.medical_record import MedicalRecord
