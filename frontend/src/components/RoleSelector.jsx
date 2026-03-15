import React, { useState } from 'react';
import { Stethoscope, User, ArrowRight, Activity, Shield, Heart, Building2, ShieldAlert } from 'lucide-react';

const RoleSelector = ({ onSelectRole }) => {
  const [hoveredRole, setHoveredRole] = useState(null);

  const roles = [
    {
      id: 'patient',
      title: 'Patient Portal',
      description: 'View your Smart Health Card, records, and scan your QR.',
      icon: Heart,
      tags: ['Health Card', 'Scan QR', 'My Records'],
      bgColor: 'bg-white',
      textColor: 'text-brand-dark',
      iconBg: 'bg-teal-50',
      iconBorder: 'border-teal-100',
      iconColor: 'text-teal-600',
      borderColorHover: 'border-teal-400',
      glowColor1: 'bg-teal-100/40',
      glowColor2: 'bg-teal-50/60',
      tagBg: 'bg-teal-50 border-teal-100',
      tagText: 'text-teal-700',
      btnText: 'text-teal-700',
      darkTheme: false
    },
    {
      id: 'doctor',
      title: 'Doctor Portal',
      description: 'Register patients, update records, and access clinical data.',
      icon: Stethoscope,
      tags: ['Register', 'Update Records', 'Scan'],
      bgColor: 'bg-brand-dark',
      textColor: 'text-brand-light',
      iconBg: 'bg-white/10',
      iconBorder: 'border-white/10',
      iconColor: 'text-brand-light',
      borderColorHover: 'border-brand-accent',
      glowColor1: 'bg-white/10',
      glowColor2: 'bg-brand-accent/20',
      tagBg: 'bg-white/10 border-white/10',
      tagText: 'text-brand-light/80',
      btnText: 'text-brand-light',
      darkTheme: true
    },
    {
      id: 'hospital',
      title: 'Hospital Node',
      description: 'Manage institutional health data and offline record synching.',
      icon: Building2,
      tags: ['Bulk Sync', 'Deploy', 'Offline'],
      bgColor: 'bg-white',
      textColor: 'text-brand-dark',
      iconBg: 'bg-amber-50',
      iconBorder: 'border-amber-100',
      iconColor: 'text-amber-600',
      borderColorHover: 'border-amber-400',
      glowColor1: 'bg-amber-100/40',
      glowColor2: 'bg-amber-50/60',
      tagBg: 'bg-amber-50 border-amber-100',
      tagText: 'text-amber-700',
      btnText: 'text-amber-700',
      darkTheme: false
    },
    {
      id: 'admin',
      title: 'Health Authority',
      description: 'Monitor AI predictions, global heatmaps, and outbreak alerts.',
      icon: ShieldAlert,
      tags: ['AI Forecast', 'Heatmaps', 'Alerts'],
      bgColor: 'bg-slate-900',
      textColor: 'text-white',
      iconBg: 'bg-indigo-500/20',
      iconBorder: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      borderColorHover: 'border-indigo-400',
      glowColor1: 'bg-indigo-500/20',
      glowColor2: 'bg-purple-500/20',
      tagBg: 'bg-indigo-500/20 border-indigo-500/30',
      tagText: 'text-indigo-200',
      btnText: 'text-indigo-300',
      darkTheme: true
    }
  ];

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-brand-accent/20 shadow-sm mb-6">
          <Activity size={20} className="text-brand-dark" />
          <span className="text-sm font-bold text-brand-dark tracking-wide uppercase">Apothecary Health Systems</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark font-serif mb-3 tracking-tight">
          Welcome to Apothecary
        </h1>
        <p className="text-brand-accent text-lg max-w-md mx-auto leading-relaxed">
          Select your role to access the appropriate secure portal.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
        
        {roles.map((role) => {
          const Icon = role.icon;
          const isHovered = hoveredRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`group ${role.bgColor} ${role.textColor} rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 cursor-pointer relative overflow-hidden text-left ${
                isHovered 
                  ? `${role.borderColorHover} shadow-2xl scale-[1.02] -translate-y-1` 
                  : `border-transparent ${role.darkTheme ? 'shadow-lg' : 'border-brand-accent/20'}`
              }`}
            >
              {/* Glow effects */}
              <div className={`absolute top-0 right-0 w-40 h-40 ${role.glowColor1} rounded-full blur-2xl transition-all duration-500 ${
                isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-40'
              } -translate-y-10 translate-x-10 pointer-events-none`}></div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 ${role.glowColor2} rounded-full blur-xl transition-all duration-500 ${
                isHovered ? 'scale-125' : 'scale-100'
              } translate-y-8 -translate-x-8 pointer-events-none`}></div>

              <div className="relative z-10">
                <div className={`${role.iconBg} border ${role.iconBorder} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  isHovered ? 'scale-110' : ''
                }`}>
                  <Icon size={32} className={role.iconColor} />
                </div>
                
                <h2 className="text-2xl font-bold font-serif mb-2 tracking-tight">{role.title}</h2>
                <p className={`${role.darkTheme ? 'text-white/70' : 'text-brand-accent'} text-sm leading-relaxed mb-6 h-10`}>
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {role.tags.map(tag => (
                    <span key={tag} className={`${role.tagBg} border text-xs font-bold px-3 py-1.5 rounded-full ${role.tagText} uppercase tracking-wider`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-bold ${role.btnText} transition-all duration-300 ${
                  isHovered ? 'translate-x-2' : ''
                }`}>
                  <span>Enter Portal</span>
                  <ArrowRight size={16} className={`transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : ''
                  }`} />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-brand-accent/60 text-xs">
          <Shield size={14} />
          <span>Secure • HIPAA Compliant • AI-Powered Insights</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
