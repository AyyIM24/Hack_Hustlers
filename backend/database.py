import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# If DATABASE_URL exists (on Render), use it. Otherwise, use local SQLite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./medtech.db")

# SQLite needs 'check_same_thread', but PostgreSQL (Render's DB) doesn't.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
