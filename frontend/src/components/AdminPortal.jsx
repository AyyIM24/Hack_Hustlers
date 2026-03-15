import React, { useState, useEffect } from 'react';
import { Activity, Users, AlertTriangle, ArrowLeft, BarChart2, MapPin } from 'lucide-react';
import { getAlerts } from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import PredictionDashboard from './PredictionDashboard';
import DiseaseHeatmap from './DiseaseHeatmap';

const AdminPortal = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('predictions');

  useEffect(() => {
    // Fetch global alerts when the HA logs in
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts(3);
        const alerts = data.alerts;
        
        // Spawn toast notifications for high severity alerts
        let count = 0;
        alerts.forEach(alert => {
          if (alert.severity === 'HIGH' && count < 3) {
            setTimeout(() => {
              toast.error(
                <div>
                  <strong>CRITICAL OUTBREAK:</strong> {alert.disease} in {alert.location}
                  <div className="text-xs opacity-80 mt-1">{alert.count} cases detected.</div>
                </div>,
                { duration: 6000, position: 'top-right' }
              );
            }, count * 1500); // Stagger the toasts
            count++;
          }
        });
      } catch (err) {
        console.error("Failed to load global alerts", err);
      }
    };
    
    fetchAlerts();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-white tracking-tight">Health Authority</h1>
              <p className="text-xs text-indigo-300 font-medium">Administrator Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('predictions')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'predictions' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <BarChart2 size={20} />
            AI Predictions
          </button>
          
          <button 
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'heatmap' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <MapPin size={20} />
            Outbreak Heatmap
          </button>
          
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'alerts' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <AlertTriangle size={20} />
            Global Alerts
          </button>

          <button 
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === 'network' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Users size={20} />
            Hospital Network
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
             onClick={onLogout}
             className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={18} />
            Logout Securely
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-bold font-serif text-slate-800">
            {activeTab === 'predictions' && 'Predictive Intelligence'}
            {activeTab === 'heatmap' && 'Global Epidemic Tracking'}
            {activeTab === 'alerts' && 'Critical Disease Alerts'}
            {activeTab === 'network' && 'Hospital Node Network'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure Connection
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 shrink-0">
             <span className="text-indigo-700 font-bold">{user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
           <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Alert Banner / Always visible intro block */}
              <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-2xl shadow-sm flex items-start gap-4 mb-8">
                <div className="bg-indigo-100 p-3 rounded-xl shrink-0">
                   <Activity className="text-indigo-600" size={24} />
                </div>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Welcome back, {user.name}</h3>
                    <p className="text-slate-600 leading-relaxed">The machine learning models are continuously analyzing regional data to forecast outbreaks based on aggregated hospital records.</p>
                 </div>
              </div>

              {/* Dynamic Content */}
              {activeTab === 'predictions' && (
                <PredictionDashboard />
              )}
              
              {activeTab === 'heatmap' && (
                <DiseaseHeatmap />
              )}
              
              {['alerts', 'network'].includes(activeTab) && (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 flex flex-col items-center justify-center text-center">
                   <div className="bg-slate-100 p-4 rounded-full mb-4">
                     {activeTab === 'alerts' && <AlertTriangle className="text-slate-400" size={32} />}
                     {activeTab === 'network' && <Users className="text-slate-400" size={32} />}
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Module Offline</h3>
                   <p className="text-slate-500 max-w-sm">This module is currently being configured for the next deployment phase.</p>
                </div>
              )}

           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
