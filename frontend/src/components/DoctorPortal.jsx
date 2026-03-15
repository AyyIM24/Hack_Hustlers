import React, { useState } from 'react';
import { Activity, UserPlus, QrCode, ScanLine, FileText, LayoutDashboard, ArrowLeft, Menu, X } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import SmartHealthCard from './SmartHealthCard';
import ScanWorkflow from './ScanWorkflow';
import MedicalRecordUpdate from './MedicalRecordUpdate';
import DiseaseDashboard from './DiseaseDashboard';
import OutbreakAlerts from './OutbreakAlerts';

const DoctorPortal = ({ onBack, user }) => {
  const [currentView, setCurrentView] = useState('register');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastRegisteredPatient, setLastRegisteredPatient] = useState(null);

  const handleRegistrationSuccess = (patientData) => {
    setLastRegisteredPatient(patientData);
  };

  const handleViewCard = () => {
    setCurrentView('card');
  };

  const navItems = [
    { id: 'register', label: 'Register Patient', icon: UserPlus },
    { id: 'card', label: 'Smart Health Card', icon: QrCode },
    { id: 'scan', label: 'Scan QR', icon: ScanLine },
    { id: 'update', label: 'Update Records', icon: FileText },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
  ];

  const renderView = () => {
    switch(currentView) {
      case 'register':
        return <RegistrationForm onRegistered={handleRegistrationSuccess} onViewCard={handleViewCard} />;
      case 'card':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="mb-8 text-center max-w-lg">
              <h2 className="text-3xl font-bold text-brand-dark font-serif">Smart Health Identity</h2>
              <p className="text-brand-accent mt-2">Access the patient's verified digital health identity card instantly.</p>
            </div>
            <SmartHealthCard patientData={lastRegisteredPatient} />
          </div>
        );
      case 'scan':
        return <ScanWorkflow />;
      case 'update':
        return <MedicalRecordUpdate />;
      case 'dashboard':
        return <DiseaseDashboard />;
      default:
        return <RegistrationForm onRegistered={handleRegistrationSuccess} onViewCard={handleViewCard} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light font-sans text-brand-dark selection:bg-brand-dark selection:text-brand-light">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-brand-accent/20 h-screen sticky top-0 flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-brand-accent/20 flex items-center gap-3">
          <div className="bg-brand-dark text-brand-light p-2 rounded-lg shadow-sm">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-dark tracking-tight leading-tight">Doctor</h1>
            <p className="text-xs text-brand-accent font-medium">Health Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">Clinical Tools</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                  isActive
                    ? 'bg-brand-dark text-brand-light shadow-md'
                    : 'text-brand-dark/80 hover:bg-brand-light/50 hover:text-brand-dark'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-light' : 'text-brand-accent'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Profile + Back */}
        <div className="border-t border-brand-accent/20">
          <div className="p-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-brand-light/30 border border-brand-accent/10 mb-3">
              <div className="h-10 w-10 rounded-full bg-brand text-brand-dark flex items-center justify-center font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">{user.name}</p>
                <p className="text-xs text-brand-accent">{user.specialization || "Medical Practitioner"}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-accent hover:bg-red-50 hover:text-red-600 transition-all font-medium text-left text-sm"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-brand-accent/20 p-4 sticky top-0 z-40 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-brand-dark font-serif">Doctor Portal</h1>
          </div>
          <div className="flex items-center gap-2">
            <OutbreakAlerts />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-brand-light rounded-lg text-brand-dark">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden md:flex bg-white border-b border-brand-accent/20 px-8 py-3 sticky top-0 z-40 justify-end items-center">
          <OutbreakAlerts />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-brand-accent/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-brand-dark" />
                <span className="font-bold text-brand-dark">Doctor Portal</span>
              </div>
              <button className="p-2 bg-brand-light rounded-lg text-brand-dark" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                      isActive
                        ? 'bg-brand-dark text-brand-light shadow-md'
                        : 'text-brand-dark/80 hover:bg-brand-light/50'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-brand-light' : 'text-brand-accent'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-brand-accent/20">
              <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-accent hover:bg-red-50 hover:text-red-600 transition-all font-medium">
                <ArrowLeft size={20} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;
