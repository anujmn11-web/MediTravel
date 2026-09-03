import math
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.hospital import Hospital
from app.models.location import Location
from app.schemas.hospital import HospitalPaginated
from typing import Optional

router = APIRouter()

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Haversine formula
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("", response_model=HospitalPaginated)
def get_hospitals(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    accreditation: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Hospital).join(Location)

    # Filter by state and city from location table
    if state:
        query = query.filter(Location.state == state)
    if city:
        query = query.filter(Location.city == city)

    # Filter by accreditation (e.g. "NABH", "JCI")
    if accreditation:
        query = query.filter(Hospital.accreditation.ilike(f"%{accreditation}%"))

    # General text search (name, address, services, description)
    if search:
        query = query.filter(
            (Hospital.name.ilike(f"%{search}%")) |
            (Hospital.address.ilike(f"%{search}%")) |
            (Hospital.description.ilike(f"%{search}%"))
        )

    # Retrieve all matched hospitals (needed for in-memory distance calculations if GPS is provided)
    all_hospitals = query.all()

    # Calculate distance and sort if user coordinates are provided
    if latitude is not None and longitude is not None:
        sorted_hospitals = []
        for hosp in all_hospitals:
            # We use coordinates from the hospital model, falling back to location coordinates if missing
            h_lat = hosp.latitude if hosp.latitude is not None else (hosp.location.latitude if hosp.location else None)
            h_lng = hosp.longitude if hosp.longitude is not None else (hosp.location.longitude if hosp.location else None)

            if h_lat is not None and h_lng is not None:
                dist = calculate_distance(latitude, longitude, h_lat, h_lng)
                hosp.distance = f"{dist:.1f} km"
                sorted_hospitals.append((dist, hosp))
            else:
                hosp.distance = None
                sorted_hospitals.append((float('inf'), hosp))

        # Sort by distance (closest first)
        sorted_hospitals.sort(key=lambda x: x[0])
        hospitals_list = [item[1] for item in sorted_hospitals]
    else:
        # Default order by ID
        for hosp in all_hospitals:
            hosp.distance = None
        hospitals_list = all_hospitals
        hospitals_list.sort(key=lambda x: x.id)

    # Perform pagination on the sorted list
    total = len(hospitals_list)
    offset = (page - 1) * size
    paginated_items = hospitals_list[offset:offset + size]
    pages = (total + size - 1) // size if total > 0 else 1

    return {
        "items": paginated_items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }
