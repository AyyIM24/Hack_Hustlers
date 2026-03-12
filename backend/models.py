from sqlalchemy import Column, Integer, String
try:
    from .database import Base
except ImportError:
    from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String, default="N/A")
    blood_group = Column(String, default="N/A")
    contact = Column(String, default="")
    location = Column(String, index=True)
    disease_history = Column(String)
    prescriptions = Column(String)
    qr_code_path = Column(String)
