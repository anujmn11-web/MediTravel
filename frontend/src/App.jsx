import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyButton from './components/EmergencyButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Emergency from './pages/Emergency';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import RegisterDoctor from './pages/RegisterDoctor';
import MedicalHistory from './pages/MedicalHistory';
import { clearCurrentPatient, loadCurrentPatient, saveCurrentPatient } from './utils/patientStorage';

function App() {
  const [currentUser, setCurrentUser] = useState(loadCurrentPatient);
  const isAuthenticated = Boolean(currentUser);

  const handleLogin = (patient) => {
    setCurrentUser(saveCurrentPatient(patient));
  };

  const handleUserUpdate = (patient) => {
    setCurrentUser(saveCurrentPatient(patient));
  };

  const handleLogout = () => {
    clearCurrentPatient();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/medical-history"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MedicalHistory currentUser={currentUser} onUserUpdate={handleUserUpdate} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-doctor"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegisterDoctor />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <EmergencyButton />
      <Footer />
    </div>
  );
}

export default App;
