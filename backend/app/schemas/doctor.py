from pydantic import BaseModel, ConfigDict, model_validator
from typing import Optional, List

class DoctorBase(BaseModel):
    full_name: str
    designation: Optional[str] = None
    specialty: str
    rating: float = 4.0
    price: int = 500
    experience: Optional[str] = None
    availability: Optional[str] = None
    location_id: int
    hospital_id: Optional[int] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(BaseModel):
    id: int
    name: str  # maps to full_name for frontend compatibility
    designation: Optional[str] = None
    specialty: str
    rating: float
    price: int
    experience: Optional[str] = None
    availability: Optional[str] = None
    state: str
    city: str
    pincode: Optional[str] = None
    tier: Optional[int] = None
    location: str  # e.g., "Apollo Clinic, New Delhi"
    hospital_id: Optional[int] = None
    location_id: int

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_fields(cls, data):
        if not isinstance(data, dict):
            loc = getattr(data, "location", None)
            state = loc.state if loc else ""
            city = loc.city if loc else ""
            pincode = loc.pincode if loc else ""
            tier = loc.tier if loc else None

            hosp = getattr(data, "hospital", None)
            hosp_name = hosp.name if hosp else "Clinic"
            location_str = f"{hosp_name}, {city}" if city else hosp_name

            return {
                "id": data.id,
                "name": data.full_name,
                "designation": data.designation,
                "specialty": data.specialty,
                "rating": data.rating,
                "price": data.price,
                "experience": data.experience,
                "availability": data.availability,
                "state": state,
                "city": city,
                "pincode": pincode,
                "tier": tier,
                "location": location_str,
                "hospital_id": data.hospital_id,
                "location_id": data.location_id
            }
        return data

class DoctorPaginated(BaseModel):
    items: List[DoctorOut]
    total: int
    page: int
    size: int
    pages: int
