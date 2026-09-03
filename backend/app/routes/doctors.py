from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.doctor import Doctor
from app.models.location import Location
from app.schemas.doctor import DoctorPaginated
from typing import Optional

router = APIRouter()

@router.get("", response_model=DoctorPaginated)
def get_doctors(
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None),
    rating: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor).join(Location)

    # Apply state/city filters from location table
    if state:
        query = query.filter(Location.state == state)
    if city:
        query = query.filter(Location.city == city)

    # Apply specialty filter
    if specialty:
        # Case insensitive exact or partial match
        query = query.filter(Doctor.specialty.ilike(f"%{specialty}%"))

    # Apply minimum rating filter
    if rating:
        query = query.filter(Doctor.rating >= rating)

    # Apply general search query (name, specialty, designation)
    if search:
        query = query.filter(
            (Doctor.full_name.ilike(f"%{search}%")) |
            (Doctor.specialty.ilike(f"%{search}%")) |
            (Doctor.designation.ilike(f"%{search}%"))
        )

    # Calculate total matching items
    total = query.count()

    # Pagination calculations
    offset = (page - 1) * size
    items = query.order_by(Doctor.rating.desc(), Doctor.id.asc()).offset(offset).limit(size).all()
    pages = (total + size - 1) // size if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }
