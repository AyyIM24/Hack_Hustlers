import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User, MapPin, Download, Droplet } from 'lucide-react';
import { BASE_URL } from '../api';

const SmartHealthCard = ({ patientData }) => {
  const cardRef = useRef(null);

  const data = patientData || {
    name: "No Patient Selected", id: "---", age: "--", gender: "N/A",
    bloodGroup: "N/A", location: "N/A", status: "No Record",
  };

  const qrValue = data.id && data.id !== '---' ? `http://localhost:5173/patient/${data.id}` : 'no-data';

  const handleDownload = async () => {
    try {
      // Use html2canvas approach via canvas
      const card = cardRef.current;
      if (!card) return;
      
      // Create a canvas from the card using browser APIs
      const canvas = document.createElement('canvas');
      const rect = card.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      
      // Draw background
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      // Draw patient info as text
      ctx.fillStyle = '#F5F5DC';
      ctx.font = 'bold 24px serif';
      ctx.fillText(data.name, 20, 40);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#D2B48C';
      ctx.fillText(`ID: ${data.id}`, 20, 65);
      ctx.fillText(`Age: ${data.age} • Gender: ${data.gender || 'N/A'}`, 20, 90);
      ctx.fillText(`Blood Group: ${data.bloodGroup || 'N/A'}`, 20, 115);
      ctx.fillText(`Location: ${data.location}`, 20, 140);
      ctx.fillText(`Status: ${data.status || 'Verified Record'}`, 20, 165);
      
      // If there's a QR code image, load and draw it
      if (data.qr_code_path) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 20, 180, 120, 120);
          ctx.fillStyle = '#D2B48C';
          ctx.font = '10px sans-serif';
          ctx.fillText('Scan QR for Patient Portal', 20, 315);
          downloadCanvas(canvas);
        };
        img.onerror = () => downloadCanvas(canvas);
        img.src = `${BASE_URL}${data.qr_code_path}`;
      } else {
        downloadCanvas(canvas);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };
  
  const downloadCanvas = (canvas) => {
    const link = document.createElement('a');
    link.download = `SmartCard-${data.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={cardRef} className="bg-brand-dark rounded-2xl shadow-xl overflow-hidden w-full max-w-sm mx-auto transition-all hover:shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="p-5 border-b border-brand-light/10 flex justify-between items-center relative z-10">
          <div>
            <h3 className="font-bold text-2xl text-brand-light font-serif tracking-wide">{data.name}</h3>
            <p className="text-brand-accent text-sm font-medium mt-0.5 tracking-wider">ID: {data.id}</p>
          </div>
          <div className="h-12 w-12 rounded-full border-2 border-brand-light/30 bg-brand-accent/20 flex items-center justify-center overflow-hidden">
            <User size={24} className="text-brand-light/70" />
          </div>
        </div>

        <div className="p-6 relative z-10 space-y-5">
          <div className="bg-brand-light p-4 rounded-xl flex flex-col items-center justify-center shadow-inner mx-auto w-40 h-40 border-4 border-white">
            {data.qr_code_path ? (
              <img src={`${BASE_URL}${data.qr_code_path}`} alt="Patient QR Code" className="w-[100px] h-[100px] object-contain" />
            ) : (
              <QRCodeSVG value={qrValue} size={100} bgColor="#F5F5DC" fgColor="#3E2723" level="M" includeMargin={false} />
            )}
            <p className="text-brand-dark/60 text-[10px] uppercase tracking-widest mt-2 font-bold">Scan to Access</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-[10px] text-brand-accent uppercase tracking-widest mb-1">Demographics</p>
              <p className="font-semibold text-brand-light text-sm">{data.age} Yrs • {data.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-brand-accent uppercase tracking-widest mb-1">Blood Group</p>
              <p className="font-semibold text-brand-light text-sm flex items-center gap-1.5 shrink-0">
                <Droplet size={14} className="text-red-400" /> {data.bloodGroup || data.blood_group || 'N/A'}
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
        
        <div className="bg-black/20 border-t border-brand-light/10 p-4 px-6 flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_8px_rgba(165,214,167,0.6)] animate-pulse"></span>
            <span className="text-brand-light/90 font-medium text-xs">{data.status || 'Verified Record'}</span>
          </div>
        </div>
      </div>

      <button onClick={handleDownload} className="mt-6 bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 transform active:scale-95">
        <Download size={18} />
        Download / Print Card
      </button>
    </div>
  );
};

export default SmartHealthCard;
