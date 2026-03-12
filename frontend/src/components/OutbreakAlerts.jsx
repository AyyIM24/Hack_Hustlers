import React, { useState, useRef, useEffect } from 'react';
import { Bell, TriangleAlert, Activity, X } from 'lucide-react';

const alerts = [
  { id: 1, icon: TriangleAlert, title: 'Unusual Spike Detected', detail: '15% increase in Malaria cases in Sector 4 over the last 48 hours.', time: '10 mins ago', severity: 'critical' },
  { id: 2, icon: Activity, title: 'Rising Trend: Dengue', detail: '8% week-over-week rise in Dengue cases across the Eastern district.', time: '1 hour ago', severity: 'critical' },
  { id: 3, icon: Activity, title: 'Flu Season Warning', detail: 'Influenza cases trending 5% above seasonal baseline in 3 zones.', time: '3 hours ago', severity: 'warning' },
];

const OutbreakAlerts = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Trigger */}
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-purple-50 transition-colors group">
        <Bell size={22} className="text-purple-800 group-hover:text-purple-900" />
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1 ring-2 ring-white">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
          <span className="relative">3</span>
        </span>
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

          {/* Alert Cards */}
          <div className="divide-y divide-purple-50 max-h-80 overflow-y-auto">
            {alerts.map((a) => {
              const Icon = a.icon;
              const isCritical = a.severity === 'critical';
              return (
                <div key={a.id} className={`flex gap-3.5 p-4 hover:bg-purple-50/40 transition-colors cursor-pointer ${isCritical ? 'border-l-[3px] border-l-red-400' : 'border-l-[3px] border-l-purple-300'}`}>
                  <div className={`shrink-0 p-2 rounded-xl ${isCritical ? 'bg-red-50 text-red-500' : 'bg-purple-100 text-purple-600'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-purple-900 text-sm leading-tight">{a.title}</p>
                    <p className="text-purple-700/70 text-xs mt-1 leading-relaxed">{a.detail}</p>
                    <p className="text-purple-400 text-[11px] font-semibold mt-1.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-purple-50/50 border-t border-purple-100 text-center">
            <button className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors uppercase tracking-wider">
              View All Alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutbreakAlerts;
