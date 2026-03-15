import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPredictions } from '../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';

const PredictionDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState('');

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPredictions();
      if (data.status === 'success') {
        setData(data.predictions);
        const diseases = Object.keys(data.predictions);
        if (diseases.length > 0) {
          setSelectedDisease(diseases[0]);
        }
      } else {
        setError(response.data.message || 'Failed to generate predictions');
      }
    } catch (err) {
      setError('Could not connect to Prediction Engine. Ensure the AI Service is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
        </div>
        <h3 className="mt-6 font-bold text-slate-800 text-lg">AI Engine Processing</h3>
        <p className="text-slate-500 text-sm mt-2 text-center max-w-sm">
          Analyzing regional health data pipelines and training predictive models...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="font-bold text-red-900 text-lg mb-2">Prediction Engine Offline</h3>
        <p className="text-red-700 text-sm text-center mb-6">{error}</p>
        <button 
          onClick={fetchPredictions}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) return null;

  const diseases = Object.keys(data);
  const currentPrediction = data[selectedDisease];
  
  // Combine historical and forecast for a continuous line graph
  const combinedChartData = [
    ...currentPrediction.historical,
    ...currentPrediction.forecast
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" />
            Epidemiological AI Forecast
          </h2>
          <p className="text-sm text-slate-500 mt-1">Machine Learning models projecting case growth over 7 days.</p>
        </div>
        
        <div className="flex gap-2">
          {diseases.map(disease => (
            <button
              key={disease}
              onClick={() => setSelectedDisease(disease)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedDisease === disease 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {disease}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ML Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4">
            <div className="bg-indigo-600/10 p-2.5 rounded-lg text-indigo-700">
               <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-sm text-indigo-900/70 font-medium mb-1">Model Confidence (R²)</p>
              <h4 className="text-2xl font-bold text-indigo-900">{currentPrediction.confidence}%</h4>
            </div>
          </div>
          
          <div className={`${currentPrediction.trend === 'increasing' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} border p-4 rounded-xl flex items-start gap-4`}>
            <div className={`${currentPrediction.trend === 'increasing' ? 'bg-red-600/10 text-red-700' : 'bg-green-600/10 text-green-700'} p-2.5 rounded-lg`}>
               {currentPrediction.trend === 'increasing' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
            <div>
              <p className={`text-sm font-medium mb-1 ${currentPrediction.trend === 'increasing' ? 'text-red-900/70' : 'text-green-900/70'}`}>
                Projected Trend
              </p>
              <h4 className={`text-2xl font-bold capitalize ${currentPrediction.trend === 'increasing' ? 'text-red-900' : 'text-green-900'}`}>
                {currentPrediction.trend}
              </h4>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-4">
            <div className="bg-slate-200 p-2.5 rounded-lg text-slate-700">
               <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Forecast Horizon</p>
              <h4 className="text-2xl font-bold text-slate-800">7 Days</h4>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Historical Cases"
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorActual)" 
                connectNulls
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="AI Prediction"
                stroke="#f43f5e" 
                strokeWidth={3}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorPredicted)" 
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboard;
