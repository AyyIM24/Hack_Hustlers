import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, XCircle } from 'lucide-react';

const QrScannerView = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState('');

  const startScanner = async () => {
    setError('');
    const scannerId = 'qr-reader';

    // Small delay to ensure the DOM element exists
    await new Promise((r) => setTimeout(r, 100));

    if (!document.getElementById(scannerId)) return;

    try {
      const html5QrCode = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Stop scanning once a code is found
          html5QrCode.stop().then(() => {
            html5QrCodeRef.current = null;
            setIsStarted(false);
            onScanSuccess(decodedText);
          }).catch(() => {});
        },
        () => {} // ignore scan failures (no QR in frame)
      );
      setIsStarted(true);
    } catch (err) {
      setError('Could not access camera. Please grant camera permissions or enter the Patient ID manually below.');
      setIsStarted(false);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current = null;
        setIsStarted(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Manual ID entry fallback
  const [manualId, setManualId] = useState('');
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualId.trim()) {
      stopScanner();
      onScanSuccess(manualId.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Camera Scanner Area */}
      <div className="bg-white rounded-2xl shadow-md border border-brand-accent/20 overflow-hidden">
        <div className="p-5 border-b border-brand-accent/10">
          <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <Camera size={20} className="text-brand-accent" />
            Camera Scanner
          </h3>
        </div>

        <div className="p-6">
          {/* Scanner viewport */}
          <div
            id="qr-reader"
            ref={scannerRef}
            className="w-full rounded-xl overflow-hidden bg-slate-100 border border-brand-accent/20"
            style={{ minHeight: isStarted ? 300 : 0 }}
          ></div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm flex items-start gap-2">
              <XCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {!isStarted ? (
              <button
                onClick={startScanner}
                className="flex-1 bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Open Camera
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Stop Camera
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual ID Entry Fallback */}
      <div className="bg-white rounded-2xl shadow-md border border-brand-accent/20 overflow-hidden">
        <div className="p-5 border-b border-brand-accent/10">
          <h3 className="text-lg font-bold text-brand-dark">Or Enter Patient ID Manually</h3>
        </div>
        <form onSubmit={handleManualSubmit} className="p-5 flex gap-3">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="e.g. APO-948271"
            className="flex-1 bg-brand-light/30 border border-brand-accent/30 rounded-xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-brand-dark focus:border-brand-dark outline-none transition-all text-brand-dark font-medium placeholder:text-brand-accent/60"
          />
          <button
            type="submit"
            className="bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-bold py-3 px-6 rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            Lookup
          </button>
        </form>
      </div>
    </div>
  );
};

export default QrScannerView;
