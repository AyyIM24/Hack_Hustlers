import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import DoctorPortal from './components/DoctorPortal';
import PatientPortal from './components/PatientPortal';

function App() {
  const [role, setRole] = useState(null);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole(null);
  };

  if (!role) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  if (role === 'doctor') {
    return <DoctorPortal onBack={handleBack} />;
  }

  if (role === 'patient') {
    return <PatientPortal onBack={handleBack} />;
  }

  return null;
}

export default App;
