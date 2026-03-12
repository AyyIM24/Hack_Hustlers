import React, { useState } from 'react';
import { Search, History, PlusCircle, CheckCircle, FileText } from 'lucide-react';

const mockHistory = [
  { id: 1, date: 'Oct 12, 2023', doctor: 'Dr. Reynolds', diagnosis: 'Seasonal Allergies', prescription: 'Antihistamines (Loratadine 10mg)' },
  { id: 2, date: 'Mar 04, 2022', doctor: 'Dr. Smith', diagnosis: 'Mild Bronchitis', prescription: 'Amoxicillin 500mg, Rest' },
];

const MedicalRecordUpdate = () => {
  const [patientFound, setPatientFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate finding a patient
    if(searchQuery.length > 2) setPatientFound(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark font-serif">Medical Record Update</h2>
        <p className="text-brand-accent mt-1">Scan QR or enter ID to view and append patient history.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-accent">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full bg-brand-light/30 border border-brand-accent/30 rounded-xl py-3.5 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark font-medium text-lg placeholder:text-brand-accent/60"
              placeholder="Scan QR or Enter Patient ID (e.g. APO-948271)"
            />
          </div>
          <button type="submit" className="bg-brand-dark text-brand-light font-bold py-3.5 px-8 rounded-xl hover:bg-brand-dark/90 transition-all whitespace-nowrap shadow-md">
            Find Patient
          </button>
        </form>
      </div>

      {patientFound && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* History Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20 h-max">
            <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2 border-b border-brand-accent/10 pb-4">
              <History size={20} className="text-brand-accent" />
              Past Visit History
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-brand-accent/20">
              {mockHistory.map((record) => (
                <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-light bg-brand-dark shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10"></div>
                  
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-brand-light/20 p-4 rounded-xl border border-brand-accent/10 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-brand-dark text-sm">{record.date}</span>
                      <span className="text-xs font-semibold text-brand-accent bg-brand-light/50 px-2 py-0.5 rounded-md">{record.doctor}</span>
                    </div>
                    <p className="text-brand-dark font-medium mt-2">{record.diagnosis}</p>
                    <div className="mt-3 flex gap-2 items-start text-sm text-brand-dark/80 bg-white p-2.5 rounded-lg border border-brand-accent/10">
                      <FileText size={16} className="text-brand-accent shrink-0 mt-0.5" />
                      <span>{record.prescription}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-brand-dark text-brand-light p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-brand-light/10 pb-4 relative z-10">
              <PlusCircle size={20} className="text-brand-success" />
              Add New Diagnosis
            </h3>
            
            <form className="space-y-5 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Record Updated Successfully!"); }}>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-light/90">Diagnosis / Condition</label>
                <input 
                  type="text" required
                  className="w-full bg-white/10 border border-brand-light/20 rounded-lg py-2.5 px-3 focus:bg-white/20 focus:ring-2 focus:ring-brand-light outline-none transition-all text-white placeholder:text-brand-light/50"
                  placeholder="e.g. Acute Pharyngitis"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-light/90">Treatment Details</label>
                <textarea 
                  rows="2" required
                  className="w-full bg-white/10 border border-brand-light/20 rounded-lg py-2.5 px-3 focus:bg-white/20 focus:ring-2 focus:ring-brand-light outline-none transition-all text-white placeholder:text-brand-light/50 resize-none"
                  placeholder="Notes on treatment administered..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-brand-light/90">Prescription</label>
                <textarea 
                  rows="2" required
                  className="w-full bg-white/10 border border-brand-light/20 rounded-lg py-2.5 px-3 focus:bg-white/20 focus:ring-2 focus:ring-brand-light outline-none transition-all text-white placeholder:text-brand-light/50 resize-none"
                  placeholder="Medication, dosage, frequency..."
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-success hover:bg-brand-success/90 text-brand-dark font-bold py-3 rounded-lg shadow-sm transition-all transform active:scale-[0.98] mt-2 flex justify-center items-center gap-2"
              >
                <CheckCircle size={18} />
                Save & Update Record
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default MedicalRecordUpdate;
