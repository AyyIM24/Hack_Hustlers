import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RegistrationForm from './components/RegistrationForm';
import SmartHealthCard from './components/SmartHealthCard';
import MedicalRecordUpdate from './components/MedicalRecordUpdate';
import DiseaseDashboard from './components/DiseaseDashboard';
import ScanWorkflow from './components/ScanWorkflow';
import OutbreakAlerts from './components/OutbreakAlerts';
import { Menu, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('register');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch(currentView) {
      case 'register':
        return <RegistrationForm />;
      case 'card':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="mb-8 text-center max-w-lg">
              <h2 className="text-3xl font-bold text-brand-dark font-serif">Smart Health Identity</h2>
              <p className="text-brand-accent mt-2">Access the patient's verified digital health identity card instantly.</p>
            </div>
            <SmartHealthCard />
          </div>
        );
      case 'scan':
        return <ScanWorkflow />;
      case 'update':
        return <MedicalRecordUpdate />;
      case 'dashboard':
        return <DiseaseDashboard />;
      default:
        return <RegistrationForm />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light font-sans text-brand-dark selection:bg-brand-dark selection:text-brand-light">
      
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Navbar Header */}
        <header className="md:hidden bg-white border-b border-brand-accent/20 p-4 sticky top-0 z-40 flex justify-between items-center">
           <div>
             <h1 className="text-lg font-bold text-brand-dark font-serif">Apothecary System</h1>
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

        {/* Main Content Wrapper */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
           {renderView()}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <button className="absolute top-4 right-4 p-2 bg-brand-light rounded-lg text-brand-dark" onClick={() => setMobileMenuOpen(false)}>
               <X size={20} />
            </button>
            <div className="transform scale-95 origin-top-left -ml-2 -mt-2">
               <Sidebar currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
