import React from 'react';
import { Activity, UserPlus, FileText, LayoutDashboard, QrCode, ScanLine } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'register', label: 'Register Patient', icon: UserPlus },
    { id: 'card', label: 'Smart Health Card', icon: QrCode },
    { id: 'scan', label: 'Scan QR', icon: ScanLine },
    { id: 'update', label: 'Update Records', icon: FileText },
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-brand-accent/20 h-screen sticky top-0 flex flex-col hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 border-b border-brand-accent/20 flex items-center gap-3">
        <div className="bg-brand-dark text-brand-light p-2 rounded-lg shadow-sm">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-dark tracking-tight leading-tight">Apothecary</h1>
          <p className="text-xs text-brand-accent font-medium">Health Systems</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">Main Menu</p>
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

      {/* User Profile Snippet */}
      <div className="p-4 border-t border-brand-accent/20 mb-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-brand-light/30 border border-brand-accent/10">
          <div className="h-10 w-10 rounded-full bg-brand text-brand-dark flex items-center justify-center font-bold text-sm">
            DR
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">Dr. Reynolds</p>
            <p className="text-xs text-brand-accent">General Practitioner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
