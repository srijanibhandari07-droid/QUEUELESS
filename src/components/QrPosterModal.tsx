import React from 'react';
import { X, QrCode, Printer, Smartphone, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface QrPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan: () => void;
}

export const QrPosterModal: React.FC<QrPosterModalProps> = ({ isOpen, onClose, onSimulateScan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Poster Canvas */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950 text-center select-none">
          {/* Header Badge */}
          <div className="inline-block bg-amber-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full mb-4 tracking-wider">
            OFFICIAL CAMPUS POSTER · CENTRAL CANTEEN
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            DON'T WAIT IN LINE.
          </h2>
          <h3 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight mt-0.5">
            OWN YOUR TIME.
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Scan below to join the digital queue from your phone. Receive a live token and pick up your meal when it chimes!
          </p>

          {/* Authentic QR SVG Display */}
          <div className="my-6 p-6 bg-white rounded-3xl inline-block shadow-2xl border-4 border-slate-800 mx-auto transform hover:scale-102 transition-transform">
            <svg
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto text-slate-950"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              {/* Outer Position Corners */}
              {/* Top-Left Corner */}
              <rect x="15" y="15" width="50" height="50" rx="6" fill="#020617" />
              <rect x="25" y="25" width="30" height="30" rx="3" fill="#ffffff" />
              <rect x="32" y="32" width="16" height="16" rx="2" fill="#020617" />

              {/* Top-Right Corner */}
              <rect x="135" y="15" width="50" height="50" rx="6" fill="#020617" />
              <rect x="145" y="25" width="30" height="30" rx="3" fill="#ffffff" />
              <rect x="152" y="32" width="16" height="16" rx="2" fill="#020617" />

              {/* Bottom-Left Corner */}
              <rect x="15" y="135" width="50" height="50" rx="6" fill="#020617" />
              <rect x="25" y="145" width="30" height="30" rx="3" fill="#ffffff" />
              <rect x="32" y="152" width="16" height="16" rx="2" fill="#020617" />

              {/* Data matrix dots pattern */}
              <rect x="75" y="20" width="10" height="10" fill="#020617" />
              <rect x="95" y="20" width="10" height="20" fill="#020617" />
              <rect x="115" y="25" width="10" height="10" fill="#020617" />
              <rect x="75" y="45" width="20" height="10" fill="#020617" />
              <rect x="105" y="45" width="10" height="10" fill="#020617" />
              <rect x="20" y="75" width="20" height="10" fill="#020617" />
              <rect x="50" y="75" width="10" height="20" fill="#020617" />
              <rect x="75" y="75" width="15" height="15" fill="#f59e0b" rx="3" />
              <rect x="100" y="75" width="25" height="10" fill="#020617" />
              <rect x="135" y="75" width="10" height="20" fill="#020617" />
              <rect x="160" y="75" width="20" height="10" fill="#020617" />

              <rect x="20" y="105" width="10" height="20" fill="#020617" />
              <rect x="40" y="105" width="20" height="10" fill="#020617" />
              <rect x="75" y="100" width="10" height="25" fill="#020617" />
              <rect x="95" y="95" width="15" height="15" fill="#020617" />
              <rect x="120" y="105" width="20" height="10" fill="#020617" />
              <rect x="150" y="105" width="10" height="20" fill="#020617" />
              <rect x="170" y="100" width="15" height="15" fill="#020617" />

              <rect x="75" y="135" width="20" height="10" fill="#020617" />
              <rect x="105" y="135" width="10" height="20" fill="#020617" />
              <rect x="125" y="140" width="15" height="15" fill="#020617" />
              <rect x="150" y="135" width="20" height="10" fill="#020617" />
              <rect x="75" y="165" width="10" height="15" fill="#020617" />
              <rect x="95" y="160" width="20" height="20" fill="#020617" />
              <rect x="130" y="165" width="25" height="15" fill="#020617" />
              <rect x="165" y="165" width="15" height="15" fill="#020617" />
            </svg>

            <div className="mt-3 text-[11px] font-mono font-bold text-slate-800 tracking-wider">
              APPLET: QUEUELESS.CAMPUS.EDU
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="grid grid-cols-3 gap-2 text-left bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs">
            <div className="flex flex-col items-center text-center p-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1">
                1
              </span>
              <span className="font-bold text-white">Scan QR</span>
              <span className="text-[10px] text-slate-400">Opens Student App</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 border-x border-slate-800">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1">
                2
              </span>
              <span className="font-bold text-white">Pick & Token</span>
              <span className="text-[10px] text-slate-400">Receive Token #A47</span>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1">
                3
              </span>
              <span className="font-bold text-white">Collect Meal</span>
              <span className="text-[10px] text-slate-400">Chime on Phone & TV</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                onSimulateScan();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulate Scan on Mobile</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
