import React, { useState } from 'react';
import { Stethoscope, User, ArrowRight, Activity, Shield, Heart } from 'lucide-react';

const RoleSelector = ({ onSelectRole }) => {
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

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
          Select your role to access the appropriate portal and get started.
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-3xl relative z-10">
        
        {/* Doctor Card */}
        <button
          onClick={() => onSelectRole('doctor')}
          onMouseEnter={() => setHoveredRole('doctor')}
          onMouseLeave={() => setHoveredRole(null)}
          className={`group flex-1 bg-brand-dark text-brand-light rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 cursor-pointer relative overflow-hidden ${
            hoveredRole === 'doctor' 
              ? 'border-brand-accent shadow-2xl scale-[1.02] -translate-y-1' 
              : 'border-brand-dark/80 shadow-lg'
          }`}
        >
          {/* Glow effect */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transition-all duration-500 ${
            hoveredRole === 'doctor' ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
          } -translate-y-10 translate-x-10 pointer-events-none`}></div>
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-xl transition-all duration-500 ${
            hoveredRole === 'doctor' ? 'scale-125' : 'scale-100'
          } translate-y-8 -translate-x-8 pointer-events-none`}></div>

          <div className="relative z-10">
            <div className={`bg-white/10 border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              hoveredRole === 'doctor' ? 'bg-white/20 scale-110' : ''
            }`}>
              <Stethoscope size={32} className="text-brand-light" />
            </div>
            
            <h2 className="text-2xl font-bold font-serif mb-2 tracking-tight">Doctor Portal</h2>
            <p className="text-brand-light/70 text-sm leading-relaxed mb-6">
              Register patients, scan QR codes, update medical records, and access the analytics dashboard.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Register', 'Scan QR', 'Records', 'Analytics'].map(tag => (
                <span key={tag} className="bg-white/10 border border-white/10 text-xs font-bold px-3 py-1.5 rounded-full text-brand-light/80 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <div className={`flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
              hoveredRole === 'doctor' ? 'translate-x-2' : ''
            }`}>
              <span>Enter Portal</span>
              <ArrowRight size={16} className={`transition-transform duration-300 ${
                hoveredRole === 'doctor' ? 'translate-x-1' : ''
              }`} />
            </div>
          </div>
        </button>

        {/* Patient Card */}
        <button
          onClick={() => onSelectRole('patient')}
          onMouseEnter={() => setHoveredRole('patient')}
          onMouseLeave={() => setHoveredRole(null)}
          className={`group flex-1 bg-white text-brand-dark rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 cursor-pointer relative overflow-hidden ${
            hoveredRole === 'patient' 
              ? 'border-teal-400 shadow-2xl scale-[1.02] -translate-y-1' 
              : 'border-brand-accent/20 shadow-lg'
          }`}
        >
          {/* Glow effect */}
          <div className={`absolute top-0 right-0 w-40 h-40 bg-teal-100/40 rounded-full blur-2xl transition-all duration-500 ${
            hoveredRole === 'patient' ? 'scale-150 opacity-100' : 'scale-100 opacity-40'
          } -translate-y-10 translate-x-10 pointer-events-none`}></div>
          <div className={`absolute bottom-0 left-0 w-32 h-32 bg-teal-50/60 rounded-full blur-xl transition-all duration-500 ${
            hoveredRole === 'patient' ? 'scale-125' : 'scale-100'
          } translate-y-8 -translate-x-8 pointer-events-none`}></div>

          <div className="relative z-10">
            <div className={`bg-teal-50 border border-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              hoveredRole === 'patient' ? 'bg-teal-100 scale-110' : ''
            }`}>
              <Heart size={32} className="text-teal-600" />
            </div>

            <h2 className="text-2xl font-bold font-serif mb-2 tracking-tight">Patient Portal</h2>
            <p className="text-brand-accent text-sm leading-relaxed mb-6">
              View your Smart Health Card, access your medical records, and scan your QR code.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {['Health Card', 'Scan QR', 'My Records'].map(tag => (
                <span key={tag} className="bg-teal-50 border border-teal-100 text-xs font-bold px-3 py-1.5 rounded-full text-teal-700 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <div className={`flex items-center gap-2 text-sm font-bold text-teal-700 transition-all duration-300 ${
              hoveredRole === 'patient' ? 'translate-x-2' : ''
            }`}>
              <span>Enter Portal</span>
              <ArrowRight size={16} className={`transition-transform duration-300 ${
                hoveredRole === 'patient' ? 'translate-x-1' : ''
              }`} />
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-brand-accent/60 text-xs">
          <Shield size={14} />
          <span>Secure • HIPAA Compliant • End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
