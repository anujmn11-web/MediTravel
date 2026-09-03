"""
app/routes/appointments.py
──────────────────────────
Appointment booking endpoints (all auth-gated).

  POST   /              — Book a new appointment
  GET    /              — List all appointments for the current patient
  PATCH  /{id}/cancel   — Cancel an appointment owned by the current patient
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.deps import get_current_patient
from app.database.session import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.patient import Patient
from app.schemas.appointment import AppointmentCreate, AppointmentOut

router = APIRouter()


# ── Book Appointment ──────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=AppointmentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Book a new appointment (auth required)",
)
def book_appointment(
    appt_in: AppointmentCreate,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    """
    Book an appointment for the authenticated patient.

    - Validates that the given doctor exists (returns 404 otherwise).
    - If hospital_id is provided, validates that the hospital exists.
    - Creates the appointment with status PENDING.
    """
    # Validate doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == appt_in.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with id={appt_in.doctor_id} not found.",
        )

    # Validate hospital if provided
    if appt_in.hospital_id is not None:
        hospital = db.query(Hospital).filter(Hospital.id == appt_in.hospital_id).first()
        if not hospital:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Hospital with id={appt_in.hospital_id} not found.",
            )

    new_appt = Appointment(
        patient_id=current_patient.id,
        doctor_id=appt_in.doctor_id,
        hospital_id=appt_in.hospital_id,
        scheduled_at=appt_in.scheduled_at,
        status=AppointmentStatus.PENDING,
    )
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return new_appt


# ── List My Appointments ──────────────────────────────────────────────────────

@router.get(
    "",
    response_model=List[AppointmentOut],
    summary="List all appointments for the current patient (auth required)",
)
def get_my_appointments(
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    """
    Return all appointments for the authenticated patient,
    ordered by scheduled_at descending (most recent first).
    """
    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_id == current_patient.id)
        .order_by(Appointment.scheduled_at.desc())
        .all()
    )
    return appointments


# ── Cancel Appointment ────────────────────────────────────────────────────────

@router.patch(
    "/{appointment_id}/cancel",
    response_model=AppointmentOut,
    summary="Cancel an appointment (auth required)",
)
def cancel_appointment(
    appointment_id: int,
    current_patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    """
    Cancel an appointment belonging to the authenticated patient.

    - Returns 404 if the appointment doesn't exist or belongs to another patient.
    - Returns 400 if the appointment is already cancelled or completed.
    """
    appt = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id,
            Appointment.patient_id == current_patient.id,
        )
        .first()
    )

    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment id={appointment_id} not found.",
        )

    if appt.status in (AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Appointment is already {appt.status.value} and cannot be cancelled.",
        )

    appt.status = AppointmentStatus.CANCELLED
    db.commit()
    db.refresh(appt)
    return appt
