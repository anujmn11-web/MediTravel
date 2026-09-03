from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.location import Location
    from app.models.medical_record import MedicalRecord
    from app.models.appointment import Appointment

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    location_id: Mapped[int] = mapped_column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location: Mapped[Optional["Location"]] = relationship("Location", back_populates="patients")
    medical_record: Mapped[Optional["MedicalRecord"]] = relationship("MedicalRecord", back_populates="patient", uselist=False, cascade="all, delete-orphan")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Patient id={self.id} email={self.email}>"
