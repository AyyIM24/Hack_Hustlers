import os
import qrcode
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

try:
    from . import models, schemas, database
    from .database import engine
except ImportError:
    import models, schemas, database
    from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedTech Backend")

# --- 1. ENABLE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. MOUNT STATIC FILES ---
os.makedirs("qrcodes", exist_ok=True)
app.mount("/qrcodes", StaticFiles(directory="qrcodes"), name="qrcodes")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.PatientResponse)
def register_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    max_id = db.query(func.max(models.Patient.id)).scalar()
    next_id = (max_id or 0) + 1
    patient_id = f"MED-{next_id:03d}"

    qr_content = f"http://localhost:5173/patient/{patient_id}"
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(qr_content)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    qr_filename = f"qrcodes/{patient_id}.png"
    img.save(qr_filename)

    db_patient = models.Patient(
        patient_id=patient_id,
        name=patient.name,
        age=patient.age,
        location=patient.location,
        disease_history=patient.disease_history,
        prescriptions=patient.prescriptions,
        qr_code_path=f"/qrcodes/{patient_id}.png"
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    from typing import Dict, Any
    patients = db.query(models.Patient).all()
    
    analytics: Dict[str, Any] = {}
    for p in patients:
        loc = p.location
        if loc not in analytics:
            analytics[loc] = {}
            
        diseases = [d.strip() for d in p.disease_history.split(",") if d.strip()]
        for d in diseases:
            if d not in analytics[loc]:
                analytics[loc][d] = 0
            analytics[loc][d] += 1
            
    return analytics
