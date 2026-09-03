from datetime import datetime, timezone
from sqlalchemy import Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.location import Location
    from app.models.hospital import Hospital
    from app.models.appointment import Appointment

class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    designation: Mapped[str] = mapped_column(String(100), nullable=True)  # e.g., "Orthopedic Surgeon"
    specialty: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # e.g., "Orthopedics"
    rating: Mapped[float] = mapped_column(Float, default=4.0)
    price: Mapped[int] = mapped_column(Integer, default=500)  # Consultation fee in INR
    experience: Mapped[str] = mapped_column(String(50), nullable=True)  # e.g., "10 years"
    availability: Mapped[str] = mapped_column(String(100), nullable=True)  # e.g., "Mon-Fri • 9 AM - 6 PM"
    location_id: Mapped[int] = mapped_column(Integer, ForeignKey("locations.id", ondelete="RESTRICT"), nullable=False, index=True)
    hospital_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("hospitals.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="doctors")
    hospital: Mapped[Optional["Hospital"]] = relationship("Hospital", back_populates="doctors")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Doctor id={self.id} name={self.full_name}>"
