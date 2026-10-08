import React, { useState, useEffect } from 'react';
import { Monitor, Bell, Clock, Users, Flame, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const CanteenTvDisplay: React.FC = () => {
  const { orders, currentServingToken, readyTokens, metrics, soundEnabled, toggleSound } = useQueue();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Currently preparing or active tokens
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const queuedOrders = orders.filter((o) => o.status === 'QUEUED');

  // Tokens ready for pickup
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* TV Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">QUEUELESS</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono px-2 py-0.5 rounded-md font-bold">
                CANTEEN TV DISPLAY
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono tracking-wider">
              CENTRAL CAMPUS CANTEEN · ACADEMIC BLOCK 4 · COUNTER 1 & 2
            </div>
          </div>
        </div>

        {/* Digital Clock & Telemetry */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider tabular-nums">
              {currentTime || '12:45:00'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Avg Wait: {metrics.avgWaitTimeMinutes}m · Kitchen Load: {metrics.kitchenLoadPercent}%
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300"
            title="Toggle TV chime audio"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main High-Visibility TV Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-stretch">
        {/* LEFT SECTION: READY FOR PICKUP (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight uppercase">
                  Ready For Pickup
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full font-bold">
                COLLECT AT COUNTER 2
              </span>
            </div>

            {/* Ready Tokens Grid (Gigantic Typography) */}
            {readyOrders.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {readyOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-emerald-950/60 border-2 border-emerald-400/80 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/10 transform transition-transform hover:scale-105 animate-pulse"
                  >
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                      PICKUP TOKEN
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
                      #{o.tokenNumber}
                    </div>
                    <div className="text-xs text-emerald-200 truncate mt-2 font-medium">
                      {o.userName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <Bell className="w-12 h-12 mb-3 text-slate-600" />
                <span className="text-lg font-bold">No tokens waiting for pickup.</span>
                <span className="text-xs">Chefs are preparing fresh orders!</span>
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Please present your digital token on your phone when collecting.</span>
            <span className="font-mono text-emerald-400 font-bold">{readyOrders.length} Order(s) Ready</span>
          </div>
        </div>

        {/* RIGHT SECTION: NOW PREPARING (Col 5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight uppercase">
                  Now Preparing
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full font-bold">
                KITCHEN
              </span>
            </div>

            {/* Preparing Tokens */}
            {preparingOrders.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {preparingOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 text-center"
                  >
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
                      COOKING
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400">
                      #{o.tokenNumber}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-1">
                      {o.userName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                No orders currently in the pan.
              </div>
            )}
          </div>

          {/* Up Next in Queue */}
          <div className="pt-6 border-t border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Next in Queue:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {queuedOrders.slice(0, 5).map((o) => (
                <span
                  key={o.id}
                  className="px-3 py-1 bg-slate-800 text-slate-300 font-mono font-bold text-sm rounded-lg border border-slate-700 whitespace-nowrap"
                >
                  #{o.tokenNumber}
                </span>
              ))}
              {queuedOrders.length > 5 && (
                <span className="text-xs text-slate-500 font-mono">
                  +{queuedOrders.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TV Bottom Live Queue Ticker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-amber-400 font-bold uppercase tracking-wider whitespace-nowrap">
            CAMPUS TICKER:
          </span>
          <div className="truncate">
            Digital tokens are active. Skip the physical line. Order from your phone by scanning canteen QR code poster at entrance!
          </div>
        </div>
        <div className="hidden sm:block text-slate-500 whitespace-nowrap pl-4">
          Powered by QUEUELESS AI/ML Prototype
        </div>
      </div>
    </div>
  );
};
