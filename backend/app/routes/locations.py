from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.location import Location
from app.schemas.location import LocationOut
from typing import List, Optional

router = APIRouter()

@router.get("/states", response_model=List[str])
def get_states(db: Session = Depends(get_db)):
    """Return sorted list of all unique states/UTs in the database."""
    rows = db.query(Location.state).distinct().order_by(Location.state).all()
    return [r[0] for r in rows]

@router.get("/cities", response_model=List[str])
def get_cities_by_state(state: str, db: Session = Depends(get_db)):
    """Return all cities for a given state (cascading dropdown support)."""
    rows = db.query(Location.city).filter(Location.state == state).order_by(Location.city).all()
    return [r[0] for r in rows]

@router.get("", response_model=List[LocationOut])
def get_locations(state: Optional[str] = None, db: Session = Depends(get_db)):
    """Return full location records, optionally filtered by state."""
    q = db.query(Location)
    if state:
        q = q.filter(Location.state == state)
    return q.order_by(Location.state, Location.city).all()
