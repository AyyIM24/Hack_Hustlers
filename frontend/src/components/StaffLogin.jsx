import React, { useState } from 'react';
import { Lock, User, ArrowLeft, ShieldCheck, Activity, Building2, ShieldAlert, Stethoscope } from 'lucide-react';
import axios from 'axios';

const StaffLogin = ({ onLoginSuccess, onBack, onRegister, role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRoleConfig = () => {
    switch(role) {
      case 'hospital':
        return {
          title: 'Hospital Node Login',
          subtitle: 'Access institutional health data and offline synchronization tools.',
          icon: Building2,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          focusRing: 'focus:ring-amber-500'
        };
      case 'admin':
        return {
          title: 'Health Authority Login',
          subtitle: 'Monitor predictive AI models, heatmaps, and global outbreaks.',
          icon: ShieldAlert,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          border: 'border-indigo-100',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700',
          focusRing: 'focus:ring-indigo-500'
        };
      case 'doctor':
      default:
        return {
          title: 'Doctor Portal Login',
          subtitle: 'Access clinical data, register patients, and update charts securely.',
          icon: Stethoscope,
          color: 'text-brand-dark',
          bg: 'bg-brand/10',
          border: 'border-brand/20',
          btnBg: 'bg-brand-dark hover:bg-brand-dark/90',
          focusRing: 'focus:ring-brand-accent'
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });

      if (response.data.success) {
        // Enforce that the user is logging into the correct portal
        if (response.data.role !== role) {
          setError(`Invalid credentials for ${config.title}.`);
        } else {
          onLoginSuccess(response.data);
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Failed to connect to authentication server. Is the backend running?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-brand-dark hover:text-brand-accent transition-colors font-medium bg-white/50 px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft size={20} />
        Back to Roles
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-accent/10">
        <div className="px-8 py-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mb-6 shadow-inner border ${config.border}`}>
              <Icon size={40} className={config.color} />
            </div>
            <h1 className="text-3xl font-bold font-serif text-brand-dark mb-2 tracking-tight">{config.title}</h1>
            <p className="text-brand-accent text-sm leading-relaxed px-4">
              {config.subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
              <Activity className="text-red-500 mt-0.5 shrink-0" size={18} />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent/50">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:border-transparent transition-all text-brand-dark placeholder:text-brand-accent/50 text-sm font-medium ${config.focusRing}`}
                  placeholder="Username"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent/50">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:border-transparent transition-all text-brand-dark placeholder:text-brand-accent/50 text-sm font-medium ${config.focusRing}`}
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${config.btnBg} text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-brand-accent">
              Don't have an account?{' '}
              <button 
                onClick={() => onRegister(role)}
                className="text-brand-dark font-bold hover:underline"
              >
                Register now
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-[10px] text-brand-accent/60 italic">
            <p>Protected by Apothecary Health Systems.</p>
            <p>Unauthorized access is strictly prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StaffLogin;
