from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.hospital import Hospital
    from app.models.doctor import Doctor

class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    pincode: Mapped[str] = mapped_column(String(10), nullable=True)
    tier: Mapped[int] = mapped_column(Integer, nullable=True)  # 1 = Metro, 2 = Major City, 3 = Town
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)

    # Relationships
    patients: Mapped[List["Patient"]] = relationship("Patient", back_populates="location")
    hospitals: Mapped[List["Hospital"]] = relationship("Hospital", back_populates="location")
    doctors: Mapped[List["Doctor"]] = relationship("Doctor", back_populates="location")

    def __repr__(self) -> str:
        return f"<Location id={self.id} {self.city}, {self.state}>"
