import React from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Flame,
  QrCode,
  Sparkles,
  BookOpen,
  Monitor,
  ChefHat,
  Smartphone,
  BarChart3,
  SplitSquareVertical,
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export type AppView = 'student' | 'staff' | 'canteen_tv' | 'admin' | 'demo_split' | 'design_thinking';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenQrPoster: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onSelectView, onOpenQrPoster }) => {
  const {
    simulateLunchRush,
    isOnline,
    toggleNetworkStatus,
    soundEnabled,
    toggleSound,
    metrics,
    lastReadyAlert,
    dismissReadyAlert,
  } = useQueue();

  const navItems = [
    { id: 'student' as AppView, label: 'Student', icon: Smartphone },
    { id: 'staff' as AppView, label: 'Staff Kitchen', icon: ChefHat },
    { id: 'canteen_tv' as AppView, label: 'Canteen TV', icon: Monitor },
    { id: 'admin' as AppView, label: 'Command Center', icon: BarChart3 },
    { id: 'demo_split' as AppView, label: 'Live Demo', icon: SplitSquareVertical },
    { id: 'design_thinking' as AppView, label: 'Design Thinking', icon: BookOpen },
  ];

  return (
    <>
      {/* Ready Alert Notification Banner */}
      {lastReadyAlert && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-sm font-semibold flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>
              Token <strong>#{lastReadyAlert}</strong> is READY FOR PICKUP at Counter 2!
            </span>
          </div>
          <button
            onClick={dismissReadyAlert}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Bar following Top Bar Contract: 3 Zones */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark (Single Element) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('student')}
              className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              QUEUELESS
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-slate-800 pl-3">
              Serving #{metrics.currentServingToken}
            </span>
          </div>

          {/* Zone 2: Navigation Links (Segmented role views) */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions & Telemetry controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Simulate Rush Button */}
            <button
              onClick={simulateLunchRush}
              title="Simulate 7 incoming orders during lunch break peak"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 hover:bg-orange-600/30 transition-colors whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate</span> Rush
            </button>

            {/* Scan QR Poster */}
            <button
              onClick={onOpenQrPoster}
              title="View physical canteen QR poster"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Canteen QR</span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
              className="p-2 rounded-lg bg-slate-800/70 text-slate-300 hover:bg-slate-700 transition-colors"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Simulated Offline Toggle */}
            <button
              onClick={toggleNetworkStatus}
              title={isOnline ? 'Test offline cache fallback' : 'Go back online'}
              className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition-colors"
              aria-label="Toggle network simulation"
            >
              {isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile View Selector Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-1 bg-slate-950/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </>
  );
};
