@echo off
echo Starting MedTech Project Services...

:: Start Backend in a new window
echo Launching Backend (FastAPI) on port 8000...
start "MedTech Backend" cmd /k ".\.venv\Scripts\uvicorn.exe backend.main:app --reload --port 8000"

:: Start Frontend in the current window
echo Launching Frontend (React) on port 5173...
cd frontend
npm run dev -- --port 5173
