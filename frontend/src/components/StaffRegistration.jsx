import React, { useState } from 'react';
import { User, Lock, Mail, Building2, Stethoscope, ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

const StaffRegistration = ({ onBack, initialRole = 'doctor' }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    name: '',
    specialization: '',
    hospital_name: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
    { id: 'hospital', label: 'Hospital/Clinic', icon: Building2 },
    { id: 'admin', label: 'Health Authority', icon: ShieldCheck }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await API.post('/staff/register', {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        specialization: formData.specialization || null,
        hospital_name: formData.hospital_name || null
      });
      toast.success("Registration successful! You can now log in.");
      onBack();
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(msg);
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
        Back to Login
      </button>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-accent/10">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Illustration or Info */}
          <div className="hidden md:flex md:w-1/3 bg-brand-dark p-10 flex-col justify-center text-white">
            <UserPlus size={48} className="mb-6 opacity-80" />
            <h2 className="text-2xl font-bold font-serif mb-4">Join Apothecary</h2>
            <p className="text-sm opacity-70 leading-relaxed">
              Create your secure account to access the APSIT S.A.F.E. healthcare ecosystem.
            </p>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-2/3 p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-brand-dark mb-2">Staff Registration</h1>
              <p className="text-brand-accent text-sm">Please provide your professional credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="flex gap-3 mb-6">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      formData.role === r.id 
                      ? 'border-brand-dark bg-brand/10 text-brand-dark ring-2 ring-brand-dark/20' 
                      : 'border-brand-accent/20 text-brand-accent hover:bg-brand-light'
                    }`}
                  >
                    <r.icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{r.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <User size={16} />
                    </div>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <Mail size={16} />
                    </div>
                    <input
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="jsmith88"
                    />
                  </div>
                </div>
              </div>

              {formData.role === 'doctor' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Specialization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <Stethoscope size={16} />
                    </div>
                    <input
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>
                </div>
              )}

              {formData.role !== 'admin' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Hospital / Clinic Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <Building2 size={16} />
                    </div>
                    <input
                      name="hospital_name"
                      required={formData.role === 'hospital'}
                      value={formData.hospital_name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="City General Hospital"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider px-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent/50">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-accent/20 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-brand-dark/20 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Register Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
