from pydantic import BaseModel, ConfigDict
from typing import Optional

class PatientCreate(BaseModel):
    name: str
    age: int
    location: str
    disease_history: str
    prescriptions: str

class PatientResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    age: int
    location: str
    disease_history: str
    prescriptions: str
    qr_code_path: str

    model_config = ConfigDict(from_attributes=True)
