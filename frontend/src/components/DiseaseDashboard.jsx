import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, Users, AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';
import { getAnalytics, getAlerts } from '../api';

const DiseaseDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [topDisease, setTopDisease] = useState({ name: '—', percent: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analytics, alertsData] = await Promise.all([
          getAnalytics(),
          getAlerts(1),
        ]);

        // Build disease totals for the chart
        const diseaseTotals = {};
        let patientCount = 0;
        const logs = [];

        for (const [location, diseases] of Object.entries(analytics)) {
          for (const [disease, count] of Object.entries(diseases)) {
            diseaseTotals[disease] = (diseaseTotals[disease] || 0) + count;
            patientCount += count;
            logs.push({ loc: location, disease, count, status: count >= 3 ? 'critical' : count >= 2 ? 'warning' : 'minor' });
          }
        }

        const chartArray = Object.entries(diseaseTotals)
          .map(([name, cases]) => ({ name, cases }))
          .sort((a, b) => b.cases - a.cases);
        
        setChartData(chartArray);
        setTotalPatients(patientCount);
        setActiveAlerts(alertsData.total_alerts || 0);

        if (chartArray.length > 0) {
          const topPercent = Math.round((chartArray[0].cases / patientCount) * 100);
          setTopDisease({ name: chartArray[0].name, percent: topPercent });
        }

        // Show top 5 recent logs
        setRecentLogs(logs.slice(0, 5));

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={48} className="text-brand-dark animate-spin" />
        <p className="text-brand-accent font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

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
            <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">Total Cases Tracked</p>
            <p className="text-3xl font-bold text-brand-dark mt-0.5">{totalPatients.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-accent/20 flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-accent uppercase tracking-wider">Active Alerts</p>
            <p className="text-3xl font-bold text-red-600 mt-0.5">{activeAlerts} <span className="text-sm text-red-400 font-medium">Hotspots</span></p>
          </div>
        </div>

        <div className="bg-brand-dark text-brand-light p-5 rounded-2xl shadow-md border border-brand-dark relative overflow-hidden flex items-center gap-4">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-4 translate-x-4 pointer-events-none"></div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 relative z-10 text-brand-success">
            <TrendingUp size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-brand-light/70 uppercase tracking-wider">Top Diagnosis</p>
            <p className="text-2xl font-bold mt-0.5">{topDisease.name} <span className="text-sm text-brand-success font-medium">{topDisease.percent}%</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-accent/20 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                <Activity className="text-brand-accent" size={24} />
                Disease Distribution
              </h3>
            </div>
          </div>
          
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[320px] text-brand-accent">No data available yet. Register patients to see analytics.</div>
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8D6E63', fontSize: 13, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#8D6E63', fontSize: 13, fontWeight: 600}} dx={-10}/>
                  <Tooltip 
                    cursor={{fill: '#F5F5DC', opacity: 0.5}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #D2B48C', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}
                    itemStyle={{ color: '#3E2723', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="cases" radius={[6, 6, 0, 0]} barSize={48} animationDuration={1000}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cases > 3 ? '#8D6E63' : '#D2B48C'} 
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Outbreak Logs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/20">
          <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
             <ShieldAlert className="text-brand-accent" size={20} />
             Disease Breakdown by Location
          </h3>
          <div className="space-y-4">
            {recentLogs.length === 0 && (
              <p className="text-brand-accent text-sm text-center py-8">No data yet.</p>
            )}
            {recentLogs.map((log, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-brand-light/30 border border-brand-accent/10">
                <div>
                   <p className="font-bold text-sm text-brand-dark">{log.disease}</p>
                   <p className="text-xs text-brand-accent font-medium">{log.loc} • {log.count} case(s)</p>
                </div>
                <div className="flex flex-col items-end gap-1">
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
