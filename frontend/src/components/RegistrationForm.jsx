import React, { useState } from 'react';
import { User, MapPin, Calendar, Activity, Phone, Droplet, Users, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { registerPatient } from '../api';

const RegistrationForm = ({ onRegistered, onViewCard }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', bloodGroup: '', location: '', contact: '', medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender || 'N/A',
        blood_group: formData.bloodGroup || 'N/A',
        contact: formData.contact || '',
        location: formData.location,
        disease_history: formData.medicalHistory || 'None',
        prescriptions: 'Pending evaluation',
      };
      const data = await registerPatient(payload);
      setRegisteredPatient(data);
      if (onRegistered) {
        onRegistered({
          id: data.patient_id,
          name: data.name,
          age: data.age,
          gender: data.gender,
          bloodGroup: data.blood_group,
          location: data.location,
          status: 'Verified Record',
          qr_code_path: data.qr_code_path,
        });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.detail || 'Registration failed. Is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setRegisteredPatient(null);
    setFormData({ name: '', age: '', gender: '', bloodGroup: '', location: '', contact: '', medicalHistory: '' });
  };

  if (registeredPatient) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-accent/20 w-full max-w-2xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full"><CheckCircle size={48} className="text-green-600" /></div>
        </div>
        <h2 className="text-3xl font-bold text-brand-dark font-serif mb-2">Registration Successful!</h2>
        <p className="text-brand-accent mb-6">Patient has been registered in the system.</p>

        <div className="bg-brand-light/50 rounded-xl p-6 mb-6 text-left space-y-2 border border-brand-accent/20">
          {[
            ['Patient ID', registeredPatient.patient_id],
            ['Name', registeredPatient.name],
            ['Age', registeredPatient.age],
            ['Gender', registeredPatient.gender],
            ['Blood Group', registeredPatient.blood_group],
            ['Location', registeredPatient.location],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="font-semibold text-brand-accent text-sm">{label}</span>
              <span className="font-bold text-brand-dark">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-brand-accent uppercase tracking-wider mb-3">Scan QR Code for Patient Portal</p>
          <div className="inline-block bg-white p-4 rounded-xl shadow-lg border-2 border-brand-accent/20">
            <img src={`http://localhost:8000${registeredPatient.qr_code_path}`} alt={`QR Code for ${registeredPatient.patient_id}`} className="w-48 h-48 mx-auto" />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={handleRegisterAnother} className="flex-1 bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 text-base">
            Register Another Patient
          </button>
          {onViewCard && (
            <button onClick={onViewCard} className="flex-1 bg-white hover:bg-brand-light text-brand-dark font-bold py-3.5 rounded-lg shadow-md border-2 border-brand-dark transition-all flex justify-center items-center gap-2 text-base">
              <CreditCard size={18} /> View Smart Card
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-accent/20 w-full max-w-2xl mx-auto relative overflow-hidden transition-all">
      <div className="absolute top-0 left-0 w-full h-2 bg-brand-dark"></div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-2 font-serif">Patient Onboarding</h2>
        <p className="text-brand-accent mt-1">Register a new patient to generate their Smart Health Card.</p>
      </div>
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">⚠️ {error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Full Name</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><User size={18} /></div>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70" placeholder="e.g. Eleanor Vance" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Age</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><Calendar size={18} /></div>
              <input type="number" name="age" value={formData.age} onChange={handleChange} min="0" required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70" placeholder="Yrs" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Gender</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><Users size={18} /></div>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark appearance-none">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Blood Group</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><Droplet size={18} /></div>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark appearance-none">
                <option value="" disabled>Select Blood Group</option>
                <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">City / Location</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><MapPin size={18} /></div>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70" placeholder="City Name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Contact Number</label>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent"><Phone size={18} /></div>
              <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>
        <div>
           <label className="block text-sm font-semibold text-brand-dark mb-1.5">Initial Disease History</label>
           <div className="relative"><div className="absolute top-3 left-3 pointer-events-none text-brand-accent"><Activity size={18} /></div>
            <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows="3" className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70 resize-none block" placeholder="e.g. Flu, Diabetes, Asthma (comma-separated)" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3.5 rounded-lg shadow-md transition-all mt-4 flex justify-center items-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? (<><Loader2 size={20} className="animate-spin" /> Registering...</>) : 'Generate Smart Card'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
