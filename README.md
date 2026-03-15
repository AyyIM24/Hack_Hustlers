# 🏥 Apothecary: APSIT S.A.F.E. Healthcare Ecosystem

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://medtechapothecary.vercel.app/)

**Apothecary** is a next-generation healthcare platform designed for efficiency, predictive accuracy, and secure patient data management. Developed for the **Hack_Hustlers** initiative, it bridges the gap between clinical registration and health authority oversight through AI-driven insights.

## 🔗 Live Demo
Experience the live application here: **[medtechapothecary.vercel.app](https://medtechapothecary.vercel.app/)**

---

## 🚀 One-Line Startup

Launch both the backend and frontend services with a single command:

```bash
.\run.bat
```

---

## ✨ Core Features

### 🆔 Smart Health Identity (QR)
- **Instant Registration**: Generate clinical-grade patient profiles in seconds.
- **Dynamic QR Cards**: Every patient receives a unique Smart Health Identity card for instant scanning and record retrieval.
- **Secure Lookups**: Authorized doctors can scan patient cards to view longitudinal health history.

### 🧠 AI Predictive Intelligence
- **Outbreak Forecasting**: Utilizes **Scikit-Learn Linear Regression** models to analyze historical trends and predict future disease cases.
- **Longitudinal Trend Analysis**: Simulated timeline analysis to identify potential health threats before they escalate.

### 🗺️ Global Outbreak Oversight
- **Real-time Heatmaps**: Integrated **Leaflet.js** maps visualizing regional disease density.
- **Triggered Alerts**: Automated alert system for Health Authorities when case counts cross predefined safety thresholds.

### 🔐 Unified Staff Access
- **Role-Based Portals**: Dedicated interfaces for **Doctors**, **Hospital Nodes**, and **Health Authorities**.
- **Secure Registration**: Staff members can self-register with role-specific profile details.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Leaflet |
| **Backend** | FastAPI, Python 3.13, SQLAlchemy, Uvicorn |
| **Artificial Intelligence** | Scikit-Learn (Linear Regression), Pandas, NumPy |
| **Database** | SQLite (Relational Storage) |
| **Connectivity** | Axios, RESTful API |

---

## 📂 Project Structure

```text
Hack_Hustlers/
├── backend/            # FastAPI Server & Python Models
│   ├── main.py         # Primary API Endpoints & AI Logic
│   ├── models.py       # SQL Alchemy Database Models
│   └── database.py     # SQLite Connection Config
├── frontend/           # Vite + React Application
│   ├── src/components/ # Reusable UI Components
│   └── App.jsx         # Main Routing & State Management
├── requirements.txt    # Global Python Dependencies
└── run.bat             # Universal Startup Script
```

---

## 🔧 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AyyIM24/Hack_Hustlers.git
   cd Hack_Hustlers
   ```

2. **Backend Setup** (Optional if using `run.bat`)
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup** (Optional if using `run.bat`)
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Project**
   ```bash
   .\run.bat
   ```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contact
**Team Hack_Hustlers**  
Project Link: [https://github.com/AyyIM24/Hack_Hustlers](https://github.com/AyyIM24/Hack_Hustlers)
