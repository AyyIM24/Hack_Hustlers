import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User, MapPin, Download, Droplet } from 'lucide-react';

const SmartHealthCard = ({ patientData }) => {
  const data = patientData || {
    name: "Eleanor Vance",
    id: "APO-948271",
    age: 34,
    gender: "Female",
    bloodGroup: "O+",
    location: "Portland, OR",
    status: "Verified Record",
    lastVisit: "Oct 12, 2023"
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Container */}
      <div className="bg-brand-dark rounded-2xl shadow-xl overflow-hidden w-full max-w-sm mx-auto transition-all hover:shadow-2xl relative">
        {/* Aesthetic Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Header */}
        <div className="p-5 border-b border-brand-light/10 flex justify-between items-center relative z-10">
          <div>
            <h3 className="font-bold text-2xl text-brand-light font-serif tracking-wide">{data.name}</h3>
            <p className="text-brand-accent text-sm font-medium mt-0.5 tracking-wider">ID: {data.id}</p>
          </div>
          {/* Avatar Placeholder */}
          <div className="h-12 w-12 rounded-full border-2 border-brand-light/30 bg-brand-accent/20 flex items-center justify-center overflow-hidden">
            <User size={24} className="text-brand-light/70" />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 relative z-10 space-y-5">
          {/* Real QR Code Section */}
          <div className="bg-brand-light p-4 rounded-xl flex flex-col items-center justify-center shadow-inner mx-auto w-40 h-40 border-4 border-white">
            <QRCodeSVG
              value={data.id}
              size={100}
              bgColor="#F5F5DC"
              fgColor="#3E2723"
              level="M"
              includeMargin={false}
            />
            <p className="text-brand-dark/60 text-[10px] uppercase tracking-widest mt-2 font-bold">Scan to Access</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-[10px] text-brand-accent uppercase tracking-widest mb-1">Demographics</p>
              <p className="font-semibold text-brand-light text-sm">{data.age} Yrs • {data.gender}</p>
            </div>
            <div>
              <p className="text-[10px] text-brand-accent uppercase tracking-widest mb-1">Blood Group</p>
              <p className="font-semibold text-brand-light text-sm flex items-center gap-1.5 shrink-0">
                <Droplet size={14} className="text-red-400" /> {data.bloodGroup}
              </p>
            </div>
          </div>

          <div>
             <p className="text-[10px] text-brand-accent uppercase tracking-widest mb-1">Location</p>
             <p className="font-semibold text-brand-light text-sm flex items-center gap-1.5">
               <MapPin size={14} className="text-brand-light/60" /> {data.location}
             </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-black/20 border-t border-brand-light/10 p-4 px-6 flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_8px_rgba(165,214,167,0.6)] animate-pulse"></span>
            <span className="text-brand-light/90 font-medium text-xs">{data.status}</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button className="mt-6 bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 transform active:scale-95">
        <Download size={18} />
        Download / Print Card
      </button>
    </div>
  );
};

export default SmartHealthCard;
