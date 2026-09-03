from pydantic import BaseModel, ConfigDict, model_validator
from typing import Optional, List
from datetime import datetime

class Coordinates(BaseModel):
    lat: float
    lng: float

class HospitalBase(BaseModel):
    name: str
    location_id: int
    type: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    description: Optional[str] = None
    services: Optional[List[str]] = None
    accreditation: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class HospitalCreate(HospitalBase):
    pass

class HospitalOut(BaseModel):
    id: int
    name: str
    state: str
    city: str
    pincode: Optional[str] = None
    tier: Optional[int] = None
    type: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    distance: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    description: Optional[str] = None
    services: Optional[List[str]] = None
    accreditation: Optional[str] = None
    location_id: int

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_fields(cls, data):
        if not isinstance(data, dict):
            loc = getattr(data, "location", None)
            state = loc.state if loc else ""
            city = loc.city if loc else ""
            # Fallback to location pincode if hospital pincode not set
            pincode = loc.pincode if loc else ""
            tier = loc.tier if loc else None

            coords = None
            if getattr(data, "latitude", None) is not None and getattr(data, "longitude", None) is not None:
                coords = {"lat": data.latitude, "lng": data.longitude}

            return {
                "id": data.id,
                "name": data.name,
                "state": state,
                "city": city,
                "pincode": pincode,
                "tier": tier,
                "type": data.type,
                "address": data.address,
                "phone": data.phone,
                "distance": getattr(data, "distance", None),
                "coordinates": coords,
                "description": data.description,
                "services": data.services,
                "accreditation": data.accreditation,
                "location_id": data.location_id
            }
        return data

class HospitalPaginated(BaseModel):
    items: List[HospitalOut]
    total: int
    page: int
    size: int
    pages: int
