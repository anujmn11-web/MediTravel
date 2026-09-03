from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.doctors import router as doctors_router
from app.routes.hospitals import router as hospitals_router
from app.routes.patients import router as patients_router
from app.routes.appointments import router as appointments_router
from app.routes.locations import router as locations_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="MediTravel API — Pan-India Medical Tourism & Healthcare Navigation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── CORS Configuration ──────────────────────────────────────────────────────
# Allow frontend dev server (Vite on localhost:5173) and future production URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
API_PREFIX = "/api"

app.include_router(doctors_router,      prefix=f"{API_PREFIX}/doctors",      tags=["Doctors"])
app.include_router(hospitals_router,    prefix=f"{API_PREFIX}/hospitals",    tags=["Hospitals"])
app.include_router(patients_router,     prefix=f"{API_PREFIX}/patients",     tags=["Patients"])
app.include_router(appointments_router, prefix=f"{API_PREFIX}/appointments", tags=["Appointments"])
app.include_router(locations_router,    prefix=f"{API_PREFIX}/locations",    tags=["Locations"])

# ── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def read_root():
    return {
        "status": "ok",
        "project": settings.PROJECT_NAME,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
