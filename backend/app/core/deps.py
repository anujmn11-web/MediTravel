"""
app/core/deps.py
────────────────
FastAPI dependency functions for authentication.

Usage:
    from app.core.deps import get_current_patient
    ...
    def my_route(patient: Patient = Depends(get_current_patient)):
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.patient import Patient

# Points Swagger's "Authorize" button to the login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/patients/login")


def get_current_patient(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Patient:
    """
    Decode Bearer JWT and return the authenticated Patient ORM object.

    Raises HTTP 401 if the token is missing, invalid, expired, or the
    patient no longer exists in the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    email = decode_access_token(token)
    if email is None:
        raise credentials_exception

    patient = db.query(Patient).filter(Patient.email == email).first()
    if patient is None:
        raise credentials_exception

    return patient
