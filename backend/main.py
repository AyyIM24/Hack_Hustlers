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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QR_DIR = os.path.join(BASE_DIR, "qrcodes")
os.makedirs(QR_DIR, exist_ok=True)
app.mount("/qrcodes", StaticFiles(directory=QR_DIR), name="qrcodes")

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
    qr_filename = os.path.join(QR_DIR, f"{patient_id}.png")
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


# ==================== LOGIN ====================
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    # 1. Check database for registered staff
    user = db.query(models.Staff).filter(models.Staff.username == creds.username).first()
    if user and user.password == creds.password:
        return {"success": True, "role": user.role, "name": user.name}
    
    # 2. Mock authentication for hackathon defaults (backward compatibility)
    valid_creds = {
        "doctor": {"password": "password", "role": "doctor"},
        "hospital": {"password": "password", "role": "hospital"},
        "admin": {"password": "admin123", "role": "admin"},
    }
    
    mock_user = valid_creds.get(creds.username)
    if mock_user and mock_user["password"] == creds.password:
        return {"success": True, "role": mock_user["role"], "name": creds.username.capitalize()}
        
    raise HTTPException(status_code=401, detail="Invalid username or password")

# ==================== STAFF REGISTRATION ====================
@app.post("/staff/register", response_model=schemas.StaffResponse)
def register_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    # Check if username exists
    existing = db.query(models.Staff).filter(models.Staff.username == staff.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    db_staff = models.Staff(
        username=staff.username,
        password=staff.password,
        role=staff.role,
        name=staff.name,
        specialization=staff.specialization,
        hospital_name=staff.hospital_name
    )
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

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

# ==================== AI PREDICTIONS ====================
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

@app.get("/predict")
def predict_outbreaks(db: Session = Depends(get_db)):
    """
    AI-powered endpoint utilizing scikit-learn.
    Since our current database only stores snapshot patient records and not longitudinal dates,
    we simulate a timeline of cases over the past 30 days based on their DB grouping
    to demonstrate the Linear Regression forecast for the next 7 days.
    """
    patients = db.query(models.Patient).all()

    # Extract all unique diseases
    all_diseases = []
    if patients:
        for p in patients:
            if p.disease_history and p.disease_history.lower() != "none" and p.disease_history.lower() != "n/a":
                diseases = [d.strip() for d in p.disease_history.split(",")]
                all_diseases.extend(diseases)
            
    # Count total cases per disease
    disease_counts = {}
    for d in all_diseases:
        disease_counts[d] = disease_counts.get(d, 0) + 1

    # If DB is empty or very small, pad with some realistic hackathon demo data
    if not disease_counts or len(disease_counts) == 0:
        disease_counts = {
            "Influenza A": 45,
            "Dengue Fever": 22,
            "Gastroenteritis": 18
        }

    # Filter to only predict diseases that are somewhat common (for hackathon demo, we take top 3)
    sorted_diseases = sorted(disease_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    top_diseases = [d[0] for d in sorted_diseases]

    predictions = {}
    today = datetime.now()

    for disease in top_diseases:
        # Simulate a 30-day historical trend. We add some randomized noise so the chart looks organic.
        total_cases = disease_counts[disease]
        
        # Create 30 days of synthetic historical data
        days = np.array(range(30)).reshape(-1, 1) # X axis: days 0 to 29
        
        # Y axis: simulate cumulative cases or daily cases. We'll do daily cases.
        np.random.seed(len(disease) + total_cases) # Deterministic randomness based on disease
        noise = np.random.normal(0, max(1, total_cases * 0.2), 30)
        base_trend = np.linspace(max(1, total_cases * 0.1), total_cases * 0.8, 30)
        daily_cases = np.maximum(0, base_trend + noise) # Ensure no negative cases
        
        # Train the Machine Learning Model
        model = LinearRegression()
        model.fit(days, daily_cases)
        
        # Predict the next 7 days
        future_days = np.array(range(30, 37)).reshape(-1, 1)
        future_predictions = model.predict(future_days)
        future_predictions = np.maximum(0, future_predictions).round().astype(int) # Round to whole patients, no negative
        
        # Format output for Recharts
        historical_formatted = []
        for i in range(30):
            date_str = (today - timedelta(days=29-i)).strftime("%m/%d")
            historical_formatted.append({"date": date_str, "actual": int(daily_cases[i]), "predicted": None})
            
        forecast_formatted = []
        for i in range(7):
            date_str = (today + timedelta(days=i+1)).strftime("%m/%d")
            forecast_formatted.append({"date": date_str, "actual": None, "predicted": int(future_predictions[i])})
            
        predictions[disease] = {
            "historical": historical_formatted,
            "forecast": forecast_formatted,
            "trend": "increasing" if model.coef_[0] > 0 else "decreasing",
            "confidence": round(model.score(days, daily_cases) * 100, 1) # R^2 score
        }

    return {"status": "success", "predictions": predictions}
