"""
app/routes/patients.py
──────────────────────
Patient authentication and profile endpoints.

  POST /register          — Create a new patient account
  POST /login             — Log in and receive a JWT access token
  GET  /me                — Get own profile (auth required)
  GET  /me/medical-record — Get own medical record (auth required)
  PUT  /me/medical-record — Create or update medical record (auth required)
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.deps import get_current_patient
from app.core.security import hash_password, verify_password, create_access_token
from app.database.session import get_db
from app.models.patient import Patient
from app.models.medical_record import MedicalRecord
from app.schemas.patient import PatientCreate, PatientOut, Token
from app.schemas.medical_record import MedicalRecordOut, MedicalRecordCreate

router = APIRouter()


# ── Registration ──────────────────────────────────────────────────────────────

@router.post(
    "/register",
    response_model=PatientOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new patient account",
)
def register_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new patient record.

    - Checks that the email is not already registered (returns 409 if taken).
    - Hashes the password with bcrypt before storing.
    """
    # Check for duplicate email
    existing = db.query(Patient).filter(Patient.email == patient_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A patient with email '{patient_in.email}' already exists.",
        )

    # Hash password and persist
    new_patient = Patient(
        full_name=patient_in.full_name,
        email=patient_in.email,
        hashed_password=hash_password(patient_in.password),
        phone=patient_in.phone,
        location_id=patient_in.location_id,
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=Token,
    summary="Log in and receive a JWT access token",
)
def login_patient(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate with email (username field) and password.

    Returns a Bearer JWT token that must be sent in the `Authorization`
    header for protected endpoints.
    """
    # OAuth2PasswordRequestForm uses 'username' field — we treat it as email
    patient = db.query(Patient).filter(Patient.email == form_data.username).first()
    if not patient or not verify_password(form_data.password, patient.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": patient.email})
    return Token(access_token=access_token)


# ── Profile ───────────────────────────────────────────────────────────────────

@router.get(
    "/me",
    response_model=PatientOut,
    summary="Get current patient's profile (auth required)",
)
def get_current_patient_profile(
    current_patient: Patient = Depends(get_current_patient),
):
    """Return the authenticated patient's profile."""
    return current_patient


# ── Medical Record ────────────────────────────────────────────────────────────

@router.get(
    "/me/medical-record",
    response_model=MedicalRecordOut,
    summary="Get current patient's medical record (auth required)",
)
def get_medical_record(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    """
    Retrieve the medical record belonging to the authenticated patient.
    Returns 404 if no record has been created yet.
    """
    record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == current_patient.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No medical record found. Use PUT /me/medical-record to create one.",
        )
    return record


@router.put(
    "/me/medical-record",
    response_model=MedicalRecordOut,
    summary="Create or update current patient's medical record (auth required)",
)
def upsert_medical_record(
    record_in: MedicalRecordCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    """
    Create or fully update the medical record for the authenticated patient.

    - If no record exists, a new one is inserted.
    - If a record already exists, it is updated in-place.
    """
    record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == current_patient.id)
        .first()
    )

    if record is None:
        # Insert new record
        record = MedicalRecord(
            patient_id=current_patient.id,
            blood_group=record_in.blood_group,
            allergies=record_in.allergies,
            history_notes=record_in.history_notes,
            emergency_contact_name=record_in.emergency_contact_name,
            emergency_contact_phone=record_in.emergency_contact_phone,
            updated_at=datetime.now(timezone.utc),
        )
        db.add(record)
    else:
        # Update existing record
        record.blood_group = record_in.blood_group
        record.allergies = record_in.allergies
        record.history_notes = record_in.history_notes
        record.emergency_contact_name = record_in.emergency_contact_name
        record.emergency_contact_phone = record_in.emergency_contact_phone
        record.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(record)
    return record
