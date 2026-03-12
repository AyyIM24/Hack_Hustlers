import React, { useState } from 'react';
import { User, MapPin, Calendar, Activity, Phone, Droplet, Users } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    location: '',
    contact: '',
    medicalHistory: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration submitted:", formData);
    alert("Patient registered successfully! Generating Smart Card...");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-accent/20 w-full max-w-2xl mx-auto relative overflow-hidden transition-all">
      <div className="absolute top-0 left-0 w-full h-2 bg-brand-dark"></div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-2 font-serif">
          Patient Onboarding
        </h2>
        <p className="text-brand-accent mt-1">Register a new patient to generate their Smart Health Card.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <User size={18} />
              </div>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70"
                placeholder="e.g. Eleanor Vance"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Age</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <Calendar size={18} />
              </div>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange} min="0" required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70"
                placeholder="Yrs"
              />
            </div>
          </div>
        </div>

        {/* Gender & Blood Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Gender</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <Users size={18} />
              </div>
              <select 
                name="gender" value={formData.gender} onChange={handleChange} required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark appearance-none"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Blood Group</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <Droplet size={18} />
              </div>
              <select 
                name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark appearance-none"
              >
                <option value="" disabled>Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">City / Location</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <MapPin size={18} />
              </div>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange} required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70"
                placeholder="City Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-dark mb-1.5">Contact Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-accent">
                <Phone size={18} />
              </div>
              <input 
                type="tel" name="contact" value={formData.contact} onChange={handleChange} required
                className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Initial Medical History */}
        <div>
           <label className="block text-sm font-semibold text-brand-dark mb-1.5">Initial Disease History</label>
           <div className="relative group">
            <div className="absolute top-3 left-3 pointer-events-none text-brand-accent">
              <Activity size={18} />
            </div>
            <textarea 
              name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows="3"
              className="pl-10 w-full bg-brand-light/30 border border-brand-accent/30 rounded-lg py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark placeholder:text-brand-accent/70 resize-none block"
              placeholder="Known allergies, previous chronic conditions..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3.5 rounded-lg shadow-md transition-all transform active:scale-[0.99] mt-4 flex justify-center text-lg"
        >
          Generate Smart Card
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
