import React, { useState } from 'react';
import { Activity, QrCode, ScanLine, FileText, LayoutDashboard, ArrowLeft, Menu, X, Building2 } from 'lucide-react';
import ScanWorkflow from './ScanWorkflow';
import MedicalRecordUpdate from './MedicalRecordUpdate';
import DiseaseDashboard from './DiseaseDashboard';

const HospitalPortal = ({ onLogout, user }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Hospital Analytics', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Patient QR', icon: ScanLine },
    { id: 'update', label: 'Update Records', icon: FileText },
  ];

  const renderView = () => {
    switch(currentView) {
      case 'scan':
        return <ScanWorkflow />;
      case 'update':
        return <MedicalRecordUpdate />;
      case 'dashboard':
        return <DiseaseDashboard />;
      default:
        return <DiseaseDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-amber-900 border-r border-amber-800 h-screen sticky top-0 flex flex-col hidden md:flex text-amber-50">
        {/* Logo */}
        <div className="p-6 border-b border-amber-800 flex items-center gap-3">
          <div className="bg-amber-100 text-amber-900 p-2 rounded-lg shadow-sm">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Hospital</h1>
            <p className="text-xs text-amber-300 font-medium">Node Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-amber-400/70 uppercase tracking-wider mb-2">Facility Tools</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                  isActive
                    ? 'bg-amber-500/20 text-white shadow-md border border-amber-500/30'
                    : 'text-amber-200/70 hover:bg-amber-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-amber-400' : 'text-amber-500'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Profile + Back */}
        <div className="border-t border-amber-800">
          <div className="p-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-300/80 hover:bg-amber-800 hover:text-white transition-all font-medium text-left"
            >
              <ArrowLeft size={18} />
              Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-amber-900 border-b border-amber-800 p-4 sticky top-0 z-40 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Building2 size={24} />
            <h1 className="text-lg font-bold font-serif">Hospital Node</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-amber-800 rounded-lg text-white">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Desktop Top Bar */}
         <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40 justify-between items-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">{user.name} Node</h2>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-sm font-medium text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Facility Active: {user.hospital_name || "Regional Office"}
            </div>
         </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50">
          {renderView()}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-amber-900 h-full shadow-2xl flex flex-col text-white">
            <div className="p-6 border-b border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <span className="font-bold">Hospital Node</span>
              </div>
              <button className="p-2 bg-amber-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
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
                        ? 'bg-amber-500/20 text-white border border-amber-500/30'
                        : 'text-amber-200/70 hover:bg-amber-800'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-amber-400' : 'text-amber-500'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-amber-800">
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-200/70 hover:bg-amber-800 hover:text-white transition-all font-medium">
                <ArrowLeft size={20} /> Secure Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalPortal;
