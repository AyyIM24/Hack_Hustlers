import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, Users, AlertTriangle, ShieldAlert } from 'lucide-react';

const data = [
  { name: 'Flu', cases: 420 },
  { name: 'Covid-19', cases: 210 },
  { name: 'Allergies', cases: 530 },
  { name: 'Asthma', cases: 150 },
  { name: 'Diabetes', cases: 280 },
];

const DiseaseDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-brand-dark font-serif">Disease Surveillance Monitor</h2>
        <p className="text-brand-accent mt-1">Real-time tracking of regional health analytics.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-accent/20 flex items-center gap-4">
          <div className="bg-brand-light p-3 rounded-xl">
            <Users size={24} className="text-brand-dark" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">Total Patients</p>
            <p className="text-3xl font-bold text-brand-dark mt-0.5">12,482</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-accent/20 flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">Active Alerts</p>
            <p className="text-3xl font-bold text-red-600 mt-0.5">3 <span className="text-sm text-red-400 font-medium">Hotspots</span></p>
          </div>
        </div>

        <div className="bg-brand-dark text-brand-light p-5 rounded-2xl shadow-md border border-brand-dark relative overflow-hidden flex items-center gap-4">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-4 translate-x-4 pointer-events-none"></div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 relative z-10 text-brand-success">
            <TrendingUp size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-brand-light/70 uppercase tracking-wider">Top Diagnosis</p>
            <p className="text-2xl font-bold mt-0.5">Allergies <span className="text-sm text-brand-success font-medium">↑ 12%</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-accent/20 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <Activity className="text-brand-accent" size={24} />
                Disease Hotspots by City
              </h3>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8D6E63', fontSize: 13, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8D6E63', fontSize: 13, fontWeight: 600}} dx={-10}/>
                <Tooltip 
                  cursor={{fill: '#F5F5DC', opacity: 0.5}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #D2B48C', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
                  itemStyle={{ color: '#3E2723', fontWeight: 'bold' }}
                />
                <Bar dataKey="cases" radius={[6, 6, 0, 0]} barSize={48} animationDuration={1000}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.cases > 400 ? '#8D6E63' : '#D2B48C'} 
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Cases Data Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20">
          <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
             <ShieldAlert className="text-brand-accent" size={20} />
             Recent Outbreak Logs
          </h3>
          <div className="space-y-4">
            {[
              { loc: 'Downtown', disease: 'Flu', patient: 'APO-391', time: '2h ago', status: 'critical' },
              { loc: 'North Hills', disease: 'Allergies', patient: 'APO-442', time: '4h ago', status: 'minor' },
              { loc: 'Westside', disease: 'Covid-19', patient: 'APO-812', time: '5h ago', status: 'warning' },
              { loc: 'Downtown', disease: 'Asthma', patient: 'APO-119', time: '1d ago', status: 'minor' },
              { loc: 'East Bay', disease: 'Flu', patient: 'APO-763', time: '1d ago', status: 'critical' },
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-brand-light/30 border border-brand-accent/10">
                <div>
                   <p className="font-bold text-sm text-brand-dark">{log.disease}</p>
                   <p className="text-xs text-brand-accent font-medium">{log.loc} • {log.patient}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-brand-accent/80 font-semibold">{log.time}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'critical' ? 'bg-red-500' : 
                    log.status === 'warning' ? 'bg-yellow-500' : 'bg-brand-success'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDashboard;
