from pydantic import BaseModel, ConfigDict
from typing import Optional

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: Optional[str] = "N/A"
    blood_group: Optional[str] = "N/A"
    contact: Optional[str] = ""
    location: str
    disease_history: str
    prescriptions: str

class PatientUpdate(BaseModel):
    disease_history: Optional[str] = None
    prescriptions: Optional[str] = None

class PatientResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    age: int
    gender: str
    blood_group: str
    contact: str
    location: str
    disease_history: str
    prescriptions: str
    qr_code_path: str

    model_config = ConfigDict(from_attributes=True)

class StaffCreate(BaseModel):
    username: str
    password: str
    role: str
    name: str
    specialization: Optional[str] = None
    hospital_name: Optional[str] = None

class StaffResponse(BaseModel):
    id: int
    username: str
    role: str
    name: str
    specialization: Optional[str]
    hospital_name: Optional[str]

    model_config = ConfigDict(from_attributes=True)
