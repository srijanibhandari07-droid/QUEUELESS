import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export const OfflineSimBanner: React.FC = () => {
  const { isOnline, toggleNetworkStatus, studentActiveOrder } = useQueue();
  const [syncingState, setSyncingState] = useState<'idle' | 'syncing' | 'synced'>('idle');

  useEffect(() => {
    if (isOnline && syncingState === 'idle') {
      // nothing
    } else if (isOnline && syncingState === 'syncing') {
      const timer = setTimeout(() => {
        setSyncingState('synced');
        setTimeout(() => setSyncingState('idle'), 2500);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncingState]);

  const handleReconnect = () => {
    setSyncingState('syncing');
    toggleNetworkStatus();
  };

  if (isOnline && syncingState === 'idle') {
    return null;
  }

  return (
    <div className="z-50 border-b text-xs font-semibold px-4 py-2 flex items-center justify-between transition-colors shadow-md">
      {!isOnline ? (
        <div className="w-full bg-rose-950/90 text-rose-200 border-rose-800 -mx-4 -my-2 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>
              <strong>CONNECTION LOST:</strong> Offline mode active.
              {studentActiveOrder && (
                <span className="ml-1 text-white underline font-mono">
                  Token #{studentActiveOrder.tokenNumber} preserved in local cache.
                </span>
              )}
            </span>
          </div>

          <button
            onClick={handleReconnect}
            className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded text-[11px] font-bold transition-colors"
          >
            Simulate Reconnect
          </button>
        </div>
      ) : syncingState === 'syncing' ? (
        <div className="w-full bg-amber-950/90 text-amber-200 border-amber-800 -mx-4 -my-2 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
            <span>
              <strong>SYNCING...</strong> Reconciling local tokens with queue bus.
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full bg-emerald-950/90 text-emerald-200 border-emerald-800 -mx-4 -my-2 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>BACK ONLINE:</strong> Real-time queue synchronized.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
