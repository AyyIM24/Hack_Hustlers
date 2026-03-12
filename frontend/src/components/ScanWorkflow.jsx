import React, { useState } from 'react';
import QrScannerView from './QrScannerView';
import SmartHealthCard from './SmartHealthCard';
import { fetchPatientById } from '../data/mockPatients';
import { ScanLine, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

const ScanWorkflow = () => {
  // States: 'scanning' | 'loading' | 'result' | 'error'
  const [phase, setPhase] = useState('scanning');
  const [patientData, setPatientData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScanSuccess = async (scannedId) => {
    setPhase('loading');
    setErrorMsg('');
    try {
      const patient = await fetchPatientById(scannedId);
      setPatientData(patient);
      setPhase('result');
    } catch (err) {
      setErrorMsg('Patient Not Found. Please check the ID and try again.');
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('scanning');
    setPatientData(null);
    setErrorMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-dark font-serif flex items-center gap-3">
          <ScanLine size={28} className="text-brand-accent" />
          Scan Patient Health Card
        </h2>
        <p className="text-brand-accent mt-1.5 ml-10">
          {phase === 'scanning' && 'Use the camera or enter a Patient ID to retrieve their health record.'}
          {phase === 'loading' && 'Fetching patient record...'}
          {phase === 'result' && 'Patient record retrieved successfully.'}
          {phase === 'error' && 'An error occurred while fetching the record.'}
        </p>
      </div>

      {/* === SCANNING PHASE === */}
      {phase === 'scanning' && (
        <QrScannerView onScanSuccess={handleScanSuccess} />
      )}

      {/* === LOADING PHASE === */}
      {phase === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-brand-accent/20">
            <Loader2 size={48} className="text-brand-dark animate-spin" />
          </div>
          <p className="text-brand-accent font-semibold text-lg">Retrieving Patient Data...</p>
          <p className="text-brand-accent/70 text-sm">Connecting to health record system</p>
        </div>
      )}

      {/* === RESULT PHASE === */}
      {phase === 'result' && patientData && (
        <div className="space-y-8">
          <SmartHealthCard patientData={patientData} />
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 transform active:scale-95"
            >
              <RotateCcw size={18} />
              Scan Next Patient
            </button>
          </div>
        </div>
      )}

      {/* === ERROR PHASE === */}
      {phase === 'error' && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="bg-red-50 p-6 rounded-2xl shadow-md border border-red-200">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-red-700 font-bold text-xl">{errorMsg}</p>
            <p className="text-brand-accent text-sm mt-2">The scanned ID does not match any record in our system.</p>
          </div>
          <button
            onClick={handleReset}
            className="bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 transform active:scale-95"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanWorkflow;
