import os
import qrcode
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List

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


# ==================== REGISTER ====================
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
        gender=patient.gender,
        blood_group=patient.blood_group,
        contact=patient.contact,
        location=patient.location,
        disease_history=patient.disease_history,
        prescriptions=patient.prescriptions,
        qr_code_path=f"/qrcodes/{patient_id}.png"
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


# ==================== GET SINGLE PATIENT ====================
@app.get("/patient/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "id": patient.patient_id,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender or "N/A",
        "bloodGroup": patient.blood_group or "N/A",
        "blood_group": patient.blood_group or "N/A",
        "contact": patient.contact or "",
        "location": patient.location,
        "disease_history": patient.disease_history,
        "prescriptions": patient.prescriptions,
        "qr_code_path": patient.qr_code_path,
        "status": "Verified Record",
    }


# ==================== LIST ALL PATIENTS ====================
@app.get("/patients")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(models.Patient).all()
    return [
        {
            "id": p.patient_id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender or "N/A",
            "blood_group": p.blood_group or "N/A",
            "contact": p.contact or "",
            "location": p.location,
            "disease_history": p.disease_history,
            "prescriptions": p.prescriptions,
            "qr_code_path": p.qr_code_path,
        }
        for p in patients
    ]


# ==================== UPDATE PATIENT RECORD ====================
@app.put("/patient/{patient_id}")
def update_patient(patient_id: str, update: schemas.PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    if update.disease_history:
        # Append new diagnosis to existing history
        existing = patient.disease_history or ""
        patient.disease_history = f"{existing}, {update.disease_history}" if existing and existing != "None" else update.disease_history
    
    if update.prescriptions:
        existing = patient.prescriptions or ""
        patient.prescriptions = f"{existing}, {update.prescriptions}" if existing and existing != "Pending evaluation" else update.prescriptions

    db.commit()
    db.refresh(patient)
    return {
        "message": "Record updated successfully",
        "patient_id": patient.patient_id,
        "disease_history": patient.disease_history,
        "prescriptions": patient.prescriptions,
    }


# ==================== ANALYTICS ====================
@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
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


# ==================== ALERTS ====================
@app.get("/alerts")
def get_alerts(threshold: int = 3, db: Session = Depends(get_db)):
    patients = db.query(models.Patient).all()

    location_disease_counts: Dict[str, Dict[str, int]] = {}
    for p in patients:
        loc = p.location
        if loc not in location_disease_counts:
            location_disease_counts[loc] = {}
        diseases = [d.strip() for d in p.disease_history.split(",") if d.strip()]
        for d in diseases:
            if d not in location_disease_counts[loc]:
                location_disease_counts[loc][d] = 0
            location_disease_counts[loc][d] += 1

    alerts: List[Dict[str, Any]] = []
    for loc, diseases in location_disease_counts.items():
        for disease, count in diseases.items():
            if count >= threshold:
                severity = "HIGH" if count >= threshold * 2 else "MEDIUM"
                alerts.append({
                    "location": loc,
                    "disease": disease,
                    "count": count,
                    "severity": severity,
                    "message": f"⚠️ {severity} ALERT: {count} cases of {disease} detected in {loc}!"
                })

    alerts.sort(key=lambda x: x["count"], reverse=True)

    return {
        "total_alerts": len(alerts),
        "threshold_used": threshold,
        "alerts": alerts
    }
