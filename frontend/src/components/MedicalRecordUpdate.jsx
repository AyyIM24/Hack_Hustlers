import React, { useState } from 'react';
import { Search, History, PlusCircle, CheckCircle, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { getPatientById, updatePatientRecord } from '../api';

const MedicalRecordUpdate = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setPatient(null);
    setUpdateSuccess('');
    try {
      const data = await getPatientById(searchQuery.trim().toUpperCase());
      setPatient(data);
    } catch {
      setError('Patient not found. Check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;
    setUpdating(true);
    setUpdateSuccess('');
    try {
      const result = await updatePatientRecord(patient.id, {
        disease_history: diagnosis.trim(),
        prescriptions: prescription.trim() || null,
      });
      setUpdateSuccess(`Record updated! New history: ${result.disease_history}`);
      setDiagnosis('');
      setPrescription('');
      // Refresh patient data
      const refreshed = await getPatientById(patient.id);
      setPatient(refreshed);
    } catch {
      setError('Failed to update record.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark font-serif">Medical Record Update</h2>
        <p className="text-brand-accent mt-1">Enter Patient ID to view and update their medical history.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent"><Search size={20} /></div>
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full bg-brand-light/30 border border-brand-accent/30 rounded-xl py-3.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark font-medium text-lg placeholder:text-brand-accent/60"
              placeholder="Enter Patient ID (e.g. MED-001)"
            />
          </div>
          <button type="submit" disabled={loading} className="bg-brand-dark text-brand-light font-bold py-3.5 px-8 rounded-xl hover:bg-brand-dark/90 transition-all whitespace-nowrap shadow-md flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            Find Patient
          </button>
        </form>
        {error && <p className="mt-4 text-red-600 font-medium text-sm flex items-center gap-2"><AlertTriangle size={16} /> {error}</p>}
      </div>

      {patient && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Patient Info + History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20 h-max">
            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2 border-b border-brand-accent/10 pb-4">
              <History size={20} className="text-brand-accent" /> Patient Record
            </h3>
            
            <div className="space-y-3 mb-6">
              {[
                ['Patient ID', patient.id],
                ['Name', patient.name],
                ['Age', patient.age],
                ['Gender', patient.gender || 'N/A'],
                ['Blood Group', patient.bloodGroup || patient.blood_group || 'N/A'],
                ['Location', patient.location],
                ['Contact', patient.contact || 'N/A'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-brand-accent/5">
                  <span className="text-sm font-semibold text-brand-accent">{label}</span>
                  <span className="font-bold text-brand-dark text-sm">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-light/30 p-4 rounded-xl border border-brand-accent/10 mb-4">
              <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">Disease History</p>
              <p className="text-brand-dark font-medium text-sm">{patient.disease_history || 'None recorded'}</p>
            </div>

            <div className="bg-brand-light/30 p-4 rounded-xl border border-brand-accent/10">
              <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">Prescriptions</p>
              <p className="text-brand-dark font-medium text-sm">{patient.prescriptions || 'None recorded'}</p>
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-brand-dark text-brand-light p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-brand-light/10 pb-4 relative z-10">
              <PlusCircle size={20} className="text-brand-success" /> Add New Diagnosis
            </h3>

            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-green-200 text-sm font-medium flex items-center gap-2 relative z-10">
                <CheckCircle size={16} /> {updateSuccess}
              </div>
            )}
            
            <form className="space-y-5 relative z-10" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-light/90">Diagnosis / Condition</label>
                <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full bg-white/10 border border-brand-light/20 rounded-lg py-2.5 px-3 focus:bg-white/20 focus:ring-2 focus:ring-brand-light outline-none transition-all text-white placeholder:text-brand-light/50"
                  placeholder="e.g. Acute Pharyngitis"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-light/90">Prescription</label>
                <textarea rows="2" value={prescription} onChange={(e) => setPrescription(e.target.value)}
                  className="w-full bg-white/10 border border-brand-light/20 rounded-lg py-2.5 px-3 focus:bg-white/20 focus:ring-2 focus:ring-brand-light outline-none transition-all text-white placeholder:text-brand-light/50 resize-none"
                  placeholder="Medication, dosage, frequency..."
                />
              </div>
              <button type="submit" disabled={updating} className="w-full bg-brand-success hover:bg-brand-success/90 text-brand-dark font-bold py-3 rounded-lg shadow-sm transition-all flex justify-center items-center gap-2">
                {updating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {updating ? 'Updating...' : 'Save & Update Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordUpdate;
