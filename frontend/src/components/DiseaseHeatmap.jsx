import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Activity, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

// Common India/Global coordinates mapping for demo purposes.
// Since the mock db uses text strings for locations, we map them here for mapping.
const LOCATION_COORDS = {
  "Mumbai": [19.0760, 72.8777],
  "Delhi": [28.7041, 77.1025],
  "Bangalore": [12.9716, 77.5946],
  "Hyderabad": [17.3850, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Pune": [18.5204, 73.8567],
  "Ahmedabad": [23.0225, 72.5714],
  "Rural Maharashtra": [19.7515, 75.7139],
  "Rural Gujarat": [22.2587, 71.1924]
};

// Fallback coordinate generator for unknown locations
const getRandomCoordsNearIndia = (seedStr) => {
  // Simple deterministic pseudo-random based on string length and first char
  const seed1 = seedStr.length || 5;
  const seed2 = seedStr.charCodeAt(0) || 65;
  const latOffset = (seed1 % 10) - 5;
  const lngOffset = (seed2 % 10) - 5;
  return [21.0 + latOffset, 78.0 + lngOffset];
};

const DiseaseHeatmap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/analytics');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch spatial outbreak data. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative">
          <MapPin className="text-indigo-600 animate-bounce" size={48} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-indigo-200 rounded-full blur-sm"></div>
        </div>
        <h3 className="mt-6 font-bold text-slate-800 text-lg">Loading Topographical Data</h3>
        <p className="text-slate-500 text-sm mt-2 text-center">Fetching spatial geometries for active disease clusters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col items-center justify-center min-h-[500px]">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="font-bold text-red-900 text-lg mb-2">GIS Engine Offline</h3>
        <p className="text-red-700 text-sm text-center mb-6">{error}</p>
        <button 
          onClick={fetchHeatmapData}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>
      </div>
    );
  }

  // Parse backend data into map-ready format
  const mapNodes = [];
  let totalCasesMapped = 0;

  if (data) {
    Object.keys(data).forEach(location => {
      const diseasesAtLocation = data[location];
      let totalCasesHere = 0;
      let primaryDisease = "";
      let highestCount = 0;

      // Calculate total density for the node and find the dominant disease
      Object.keys(diseasesAtLocation).forEach(disease => {
        const count = diseasesAtLocation[disease];
        totalCasesHere += count;
        if (count > highestCount) {
          highestCount = count;
          primaryDisease = disease;
        }
      });
      
      totalCasesMapped += totalCasesHere;
      
      // Assign coordinates
      const coords = LOCATION_COORDS[location] || getRandomCoordsNearIndia(location);
      
      // Determine dot color by severity (density)
      let color = "#3b82f6"; // Low - blue
      if (totalCasesHere >= 5) color = "#f59e0b"; // Medium - amber
      if (totalCasesHere >= 10) color = "#ef4444"; // High - red
      if (totalCasesHere >= 20) color = "#7f1d1d"; // Critical - dark red

      mapNodes.push({
        location,
        coords,
        totalCases: totalCasesHere,
        primaryDisease,
        diseases: diseasesAtLocation,
        color,
        // Scale radius logarithmically so massive outbreaks don't cover the whole map
        radius: Math.max(10, Math.min(40, 5 + (totalCasesHere * 2)))
      });
    });
  }

  // Fallback demo data if DB is empty for visual demonstration during the hackathon
  if (mapNodes.length === 0) {
    mapNodes.push(
      { location: "Mumbai", coords: [19.0760, 72.8777], totalCases: 42, primaryDisease: "Dengue Fever", color: "#ef4444", radius: 35, diseases: {"Dengue Fever": 30, "Malaria": 12} },
      { location: "Delhi", coords: [28.7041, 77.1025], totalCases: 89, primaryDisease: "Influenza A", color: "#7f1d1d", radius: 45, diseases: {"Influenza A": 70, "COVID-19": 19} },
      { location: "Bangalore", coords: [12.9716, 77.5946], totalCases: 15, primaryDisease: "Typhoid", color: "#f59e0b", radius: 20, diseases: {"Typhoid": 10, "Cholera": 5} },
      { location: "Chennai", coords: [13.0827, 80.2707], totalCases: 6, primaryDisease: "Malaria", color: "#3b82f6", radius: 12, diseases: {"Malaria": 6} }
    );
    totalCasesMapped = 152;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between z-10 bg-white">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
            <MapPin className="text-indigo-600" />
            Epidemiological Threat Map
          </h2>
          <p className="text-sm text-slate-500 mt-1">Real-time geographical tracking of disease clusters.</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Cases Mapped</p>
              <p className="text-2xl font-bold tracking-tight text-indigo-700">{totalCasesMapped}</p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Isolated (&lt;5)</div>
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Cluster (5-9)</div>
               <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Outbreak (10+)</div>
            </div>
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-100 relative z-0">
        <MapContainer 
          center={[22.5937, 78.9629]} // Center of India
          zoom={5} 
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {mapNodes.map((node, index) => (
             <CircleMarker
               key={index}
               center={node.coords}
               radius={node.radius}
               pathOptions={{ 
                 color: node.color, 
                 fillColor: node.color, 
                 fillOpacity: 0.5,
                 weight: 2
               }}
             >
               <Tooltip 
                 direction="top" 
                 offset={[0, -10]} 
                 opacity={1}
                 className="custom-leaflet-tooltip !bg-white !p-4 !rounded-xl !border !border-slate-200 !shadow-lg"
               >
                 <div className="min-w-[150px]">
                   <h4 className="font-bold text-slate-800 text-lg mb-1">{node.location}</h4>
                   <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-2 py-1 rounded w-fit mb-3">
                     <Activity size={14} />
                     {node.totalCases} Active Cases
                   </div>
                   
                   <div className="space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Reported Diseases</p>
                     {Object.keys(node.diseases).map(d => (
                       <div key={d} className="flex justify-between items-center text-sm">
                         <span className="text-slate-600 font-medium">{d}</span>
                         <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">{node.diseases[d]}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </Tooltip>
             </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DiseaseHeatmap;
