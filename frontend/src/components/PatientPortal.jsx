import React, { useState } from 'react';
import { Heart, Search, ScanLine, CreditCard, ArrowLeft, Loader2, AlertTriangle, Menu, X, Home } from 'lucide-react';
import SmartHealthCard from './SmartHealthCard';
import QrScannerView from './QrScannerView';
import { getPatientById } from '../api';

const PatientPortal = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('lookup');
  const [patientData, setPatientData] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setError('');
    setPatientData(null);
    try {
      const data = await getPatientById(searchId.trim().toUpperCase());
      setPatientData({
        id: data.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup || data.blood_group,
        location: data.location,
        disease_history: data.disease_history,
        prescriptions: data.prescriptions,
        qr_code_path: data.qr_code_path,
        status: data.status || 'Verified Record',
      });
      setCurrentView('card');
    } catch {
      setError('Patient not found. Please check your Patient ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = async (scannedValue) => {
    setLoading(true);
    setError('');
    try {
      let patientId = scannedValue;
      if (scannedValue.includes('/patient/')) {
        patientId = scannedValue.split('/patient/').pop();
      }
      const data = await getPatientById(patientId);
      setPatientData({
        id: data.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup || data.blood_group,
        location: data.location,
        disease_history: data.disease_history,
        prescriptions: data.prescriptions,
        qr_code_path: data.qr_code_path,
        status: data.status || 'Verified Record',
      });
      setCurrentView('card');
    } catch {
      setError('Patient not found from scanned QR code.');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'lookup', label: 'Find My Record', icon: Search },
    { id: 'scan', label: 'Scan QR Code', icon: ScanLine },
    { id: 'card', label: 'My Health Card', icon: CreditCard },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'lookup':
        return (
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-brand-dark font-serif flex items-center gap-3">
                <Search size={28} className="text-teal-500" />
                Find Your Health Record
              </h2>
              <p className="text-brand-accent mt-1.5 ml-10">Enter your Patient ID to view your Smart Health Card.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-teal-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-teal-600"></div>
              
              <form onSubmit={handleSearch} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Patient ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="pl-12 w-full bg-teal-50/30 border border-teal-200/50 rounded-xl py-3.5 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all text-brand-dark font-medium text-lg placeholder:text-brand-accent/50"
                      placeholder="e.g. MED-001"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 text-lg disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> Searching...</>
                  ) : (
                    <><Search size={20} /> Find My Record</>
                  )}
                </button>
              </form>
            </div>

            {/* Help text */}
            <div className="mt-6 bg-teal-50/50 border border-teal-100 rounded-xl p-4 text-center">
              <p className="text-sm text-teal-700">
                <span className="font-semibold">Don't have your Patient ID?</span> Use the{' '}
                <button onClick={() => setCurrentView('scan')} className="underline font-bold text-teal-600 hover:text-teal-800">
                  QR Scanner
                </button>{' '}
                to scan the code on your health card.
              </p>
            </div>
          </div>
        );

      case 'scan':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-brand-dark font-serif flex items-center gap-3">
                <ScanLine size={28} className="text-teal-500" />
                Scan Your Health Card
              </h2>
              <p className="text-brand-accent mt-1.5 ml-10">Point your camera at the QR code on your printed health card.</p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} /> {error}
              </div>
            )}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-teal-100">
                  <Loader2 size={48} className="text-teal-600 animate-spin" />
                </div>
                <p className="text-brand-accent font-semibold text-lg">Retrieving Your Record...</p>
              </div>
            ) : (
              <QrScannerView onScanSuccess={handleScanSuccess} />
            )}
          </div>
        );

      case 'card':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {patientData ? (
              <div className="space-y-8">
                <div className="text-center max-w-lg mx-auto">
                  <h2 className="text-3xl font-bold text-brand-dark font-serif">Your Smart Health Card</h2>
                  <p className="text-brand-accent mt-2">This is your verified digital health identity.</p>
                </div>
                <SmartHealthCard patientData={patientData} />

                {/* Patient Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 max-w-sm mx-auto w-full">
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b border-teal-100 pb-3">Medical Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Disease History</p>
                      <p className="text-brand-dark text-sm font-medium">{patientData.disease_history || 'None recorded'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Current Prescriptions</p>
                      <p className="text-brand-dark text-sm font-medium">{patientData.prescriptions || 'None recorded'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => { setPatientData(null); setCurrentView('lookup'); setSearchId(''); }}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Search size={18} /> Look Up Another Record
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 inline-block">
                  <CreditCard size={48} className="text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark font-serif">No Card Loaded</h2>
                <p className="text-brand-accent max-w-sm">Search for your Patient ID or scan your QR code to view your Smart Health Card.</p>
                <button
                  onClick={() => setCurrentView('lookup')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto"
                >
                  <Search size={18} /> Find My Record
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light font-sans text-brand-dark">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-teal-100 h-screen sticky top-0 flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-teal-100 flex items-center gap-3">
          <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
            <Heart size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-dark tracking-tight leading-tight">Patient</h1>
            <p className="text-xs text-teal-600 font-medium">Health Portal</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">My Health</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-brand-dark/80 hover:bg-teal-50 hover:text-brand-dark'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-teal-500'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Back */}
        <div className="p-4 border-t border-teal-100">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-accent hover:bg-red-50 hover:text-red-600 transition-all font-medium text-left"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-teal-100 p-4 sticky top-0 z-40 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-teal-600" />
            <h1 className="text-lg font-bold text-brand-dark font-serif">Patient Portal</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-teal-50 rounded-lg text-teal-700">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-teal-100 px-8 py-3 sticky top-0 z-40 justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
            <Home size={16} />
            <span>Patient Portal</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-accent">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Secure Connection
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-teal-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-teal-600" />
                <span className="font-bold text-brand-dark">Patient Portal</span>
              </div>
              <button className="p-2 bg-teal-50 rounded-lg text-teal-700" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-brand-dark/80 hover:bg-teal-50'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-teal-500'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-teal-100">
              <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-accent hover:bg-red-50 hover:text-red-600 transition-all font-medium">
                <ArrowLeft size={20} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
