from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.patient import Patient

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    blood_group: Mapped[str] = mapped_column(String(10), nullable=True)
    allergies: Mapped[list] = mapped_column(JSON, nullable=True)  # Stores JSON array, e.g. ["Peanuts", "Penicillin"]
    history_notes: Mapped[str] = mapped_column(Text, nullable=True)
    emergency_contact_name: Mapped[str] = mapped_column(String(100), nullable=True)
    emergency_contact_phone: Mapped[str] = mapped_column(String(20), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    patient: Mapped["Patient"] = relationship("Patient", back_populates="medical_record")

    def __repr__(self) -> str:
        return f"<MedicalRecord id={self.id} patient_id={self.patient_id}>"
