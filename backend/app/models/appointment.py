import enum
from datetime import datetime, timezone
from sqlalchemy import Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.doctor import Doctor
    from app.models.hospital import Hospital

class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id: Mapped[int] = mapped_column(Integer, ForeignKey("doctors.id", ondelete="RESTRICT"), nullable=False, index=True)
    hospital_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("hospitals.id", ondelete="SET NULL"), nullable=True, index=True)
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus),
        default=AppointmentStatus.PENDING,
        nullable=False
    )
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patient: Mapped["Patient"] = relationship("Patient", back_populates="appointments")
    doctor: Mapped["Doctor"] = relationship("Doctor", back_populates="appointments")
    hospital: Mapped[Optional["Hospital"]] = relationship("Hospital", back_populates="appointments")

    def __repr__(self) -> str:
        return f"<Appointment id={self.id} patient_id={self.patient_id} status={self.status}>"
