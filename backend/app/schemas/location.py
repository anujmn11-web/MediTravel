from pydantic import BaseModel, ConfigDict
from typing import Optional

class LocationBase(BaseModel):
    state: str
    city: str
    pincode: Optional[str] = None
    tier: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationCreate(LocationBase):
    pass

class LocationOut(LocationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
