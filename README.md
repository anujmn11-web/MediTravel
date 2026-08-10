# 🏥 MediTravel

> **Your trusted companion for medical tourism — connecting patients with top hospitals and doctors worldwide.**

MediTravel is a full-stack web platform that simplifies medical travel by helping patients discover hospitals, find specialist doctors, manage their medical history, and handle emergency situations — all from one unified interface.

---

## ✨ Features

- 🔍 **Hospital Discovery** — Search and explore top-rated hospitals with filters by specialty, location, and ratings
- 👨‍⚕️ **Doctor Directory** — Browse verified specialist doctors, view profiles, and connect directly
- 🧾 **Medical History** — Securely store and manage your personal medical records
- 🚨 **Emergency Assistance** — Quick access to emergency contacts and urgent care services
- 🔐 **Authentication** — Secure user login and registration system
- 🤖 **MediTravel AI** — AI-powered assistant module to guide patients (in development)
- 📋 **Doctor Registration** — Doctors can register and list themselves on the platform

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React (Vite)** | UI framework |
| **React Router** | Client-side routing |
| **JavaScript (ES6+)** | Core logic |
| **CSS** | Styling & animations |

### Backend
| Technology | Purpose |
|---|---|
| **Python** | Backend language |
| **REST API Routes** | API endpoints |
| **Database Layer** | Data persistence |

---

## 📁 Project Structure

```
MediTravel/
├── frontend/               # React + Vite frontend
│   └── src/
│       ├── pages/          # Route-level pages
│       │   ├── Home.jsx
│       │   ├── Hospitals.jsx
│       │   ├── Doctors.jsx
│       │   ├── MedicalHistory.jsx
│       │   ├── Emergency.jsx
│       │   ├── Login.jsx
│       │   ├── About.jsx
│       │   ├── Contact.jsx
│       │   └── RegisterDoctor.jsx
│       ├── components/     # Reusable UI components
│       ├── data/           # Static data & content
│       ├── services/       # API service calls
│       └── utils/          # Utility helpers
├── backend/                # Python backend
│   ├── routes/             # API route handlers
│   ├── models/             # Data models
│   └── database/           # Database configuration
├── MediTravel-AI/          # AI assistant module (WIP)
├── package.json            # Root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anujmn11-web/MediTravel.git
   cd MediTravel
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the Python backend**
   ```bash
   cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS / Linux
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Running the App

**Frontend (development server)**
```bash
npm run dev
```
> Runs on `http://localhost:5173` by default.

**Backend**
```bash
cd backend
python app.py
```

---

## 📸 Pages Overview

| Page | Description |
|---|---|
| **Home** | Landing page with hero section and feature highlights |
| **Hospitals** | Browse and filter hospitals by specialty and location |
| **Doctors** | View specialist doctor profiles and specializations |
| **Medical History** | Manage personal medical records securely |
| **Emergency** | Access emergency contacts and urgent care info |
| **Login / Register** | User authentication portal |
| **About** | Project mission and team |
| **Contact** | Reach out for support or partnerships |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 🐛 Issues

Found a bug or have a feature request? Open an issue at:  
👉 [https://github.com/anujmn11-web/MediTravel/issues](https://github.com/anujmn11-web/MediTravel/issues)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Made with ❤️ as a college project by the MediTravel team.

> ⭐ If you find this project useful, please consider giving it a star on GitHub!
