import React, { useState, useEffect } from 'react';
import RoleSelector from './components/RoleSelector';
import StaffLogin from './components/StaffLogin';
import StaffRegistration from './components/StaffRegistration';
import DoctorPortal from './components/DoctorPortal';
import PatientPortal from './components/PatientPortal';
import AdminPortal from './components/AdminPortal';
import HospitalPortal from './components/HospitalPortal';
import { WifiOff } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null); // { role, name, ... }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffRoleAttempt, setStaffRoleAttempt] = useState(null); // 'doctor', 'hospital', 'admin'
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSelectRole = (selectedRole) => {
    if (selectedRole === 'patient') {
      setUser({ role: 'patient' });
      setIsAuthenticated(true); // Patients don't log in explicitly, just ID search
    } else {
      // For staff (Doctor, Hospital, Admin), go to login screen
      setStaffRoleAttempt(selectedRole);
    }
  };

  const handleStaffLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setStaffRoleAttempt(null);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setStaffRoleAttempt(null);
  };

  const handleBackToRoles = () => {
    setUser(null);
    setStaffRoleAttempt(null);
    setIsRegistering(false);
  };

  const handleToggleRegister = (selectedRole) => {
    if (selectedRole) setStaffRoleAttempt(selectedRole);
    setIsRegistering(!isRegistering);
  };

  const renderContent = () => {
    if (!user && !staffRoleAttempt) {
      return <RoleSelector onSelectRole={handleSelectRole} />;
    }

    if (staffRoleAttempt && !isAuthenticated) {
      if (isRegistering) {
        return <StaffRegistration onBack={() => setIsRegistering(false)} initialRole={staffRoleAttempt} />;
      }
      return (
        <StaffLogin 
          onBack={handleBackToRoles} 
          onLoginSuccess={handleStaffLogin} 
          onRegister={handleToggleRegister}
          role={staffRoleAttempt} 
        />
      );
    }

    if (isAuthenticated && user.role === 'patient') {
      return <PatientPortal onBack={handleLogout} />;
    }
    
    if (isAuthenticated && user.role === 'admin') {
      return <AdminPortal onLogout={handleLogout} user={user} />;
    }
    
    if (isAuthenticated && user.role === 'hospital') {
      return <HospitalPortal onLogout={handleLogout} user={user} />;
    }
    
    if (isAuthenticated && user.role === 'doctor') {
      return <DoctorPortal onBack={handleLogout} user={user} />;
    }

    return null;
  };

  return (
    <>
      {isOffline && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium z-50 fixed top-0 left-0 right-0 shadow-md animate-fade-in-down">
          <WifiOff size={16} />
          You are currently offline. Viewing cached local data. Sync will resume when connection is restored.
        </div>
      )}
      <div className={isOffline ? "pt-9" : ""}>
        {renderContent()}
      </div>
    </>
  );
}

export default App;
