import React, { useState, useRef, useEffect } from 'react';
import { Bell, TriangleAlert, Activity, X, Loader2 } from 'lucide-react';
import { getAlerts } from '../api';

const OutbreakAlerts = () => {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch alerts when dropdown opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(false);
      getAlerts(1) // threshold=1 to show all trends
        .then((data) => {
          setAlerts(data.alerts || []);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Trigger */}
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-purple-50 transition-colors group">
        <Bell size={22} className="text-purple-800 group-hover:text-purple-900" />
        {alerts.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1 ring-2 ring-white">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
            <span className="relative">{alerts.length}</span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 z-50 overflow-hidden animate-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 bg-purple-50/50">
            <h3 className="font-bold text-purple-800 text-sm uppercase tracking-wider">Outbreak Alerts</h3>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-purple-100 text-purple-400 hover:text-purple-800 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="divide-y divide-purple-50 max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8 gap-2 text-purple-600">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-medium">Loading alerts...</span>
              </div>
            )}

            {error && (
              <div className="p-6 text-center text-red-500 text-sm font-medium">
                Could not fetch alerts. Is the backend running?
              </div>
            )}

            {!loading && !error && alerts.length === 0 && (
              <div className="p-6 text-center text-purple-400 text-sm font-medium">
                No outbreak alerts at this time. ✅
              </div>
            )}

            {!loading && !error && alerts.map((a, index) => {
              const isCritical = a.severity === 'HIGH';
              const Icon = isCritical ? TriangleAlert : Activity;
              return (
                <div key={index} className={`flex gap-3.5 p-4 hover:bg-purple-50/40 transition-colors cursor-pointer ${isCritical ? 'border-l-[3px] border-l-red-400' : 'border-l-[3px] border-l-purple-300'}`}>
                  <div className={`shrink-0 p-2 rounded-xl ${isCritical ? 'bg-red-50 text-red-500' : 'bg-purple-100 text-purple-600'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-purple-900 text-sm leading-tight">
                      {a.disease} — {a.location}
                    </p>
                    <p className="text-purple-700/70 text-xs mt-1 leading-relaxed">
                      {a.count} cases detected. Severity: {a.severity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-purple-50/50 border-t border-purple-100 text-center">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
              Live data from backend
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutbreakAlerts;
