from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.location import Location
    from app.models.doctor import Doctor
    from app.models.appointment import Appointment

class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    location_id: Mapped[int] = mapped_column(Integer, ForeignKey("locations.id", ondelete="RESTRICT"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(100), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    services: Mapped[list] = mapped_column(JSON, nullable=True)  # Stores JSON array e.g., ["Cardiology", "Neurology"]
    accreditation: Mapped[str] = mapped_column(String(100), nullable=True, index=True)  # e.g., "JCI, NABH"
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="hospitals")
    doctors: Mapped[List["Doctor"]] = relationship("Doctor", back_populates="hospital")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="hospital")

    def __repr__(self) -> str:
        return f"<Hospital id={self.id} name={self.name}>"
