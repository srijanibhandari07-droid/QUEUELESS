import React, { useState } from 'react';
import {
  SplitSquareVertical,
  Play,
  CheckCircle2,
  Bell,
  Flame,
  RotateCcw,
  Sparkles,
  Smartphone,
  ChefHat,
  Monitor,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { StudentApp } from './StudentApp';
import { StaffDashboard } from './StaffDashboard';
import { CanteenTvDisplay } from './CanteenTvDisplay';

export const LiveDemoSplitView: React.FC = () => {
  const {
    orders,
    currentServingToken,
    readyTokens,
    advanceOrderStatus,
    simulateLunchRush,
    resetDemo,
    metrics,
  } = useQueue();

  // Find demo order (Srijani's order or highest queued order, e.g. A47 or A44)
  const targetDemoOrder =
    orders.find((o) => o.tokenNumber === 'A47') ||
    orders.find((o) => o.status === 'PREPARING' || o.status === 'QUEUED') ||
    orders[orders.length - 1];

  const [activePane, setActivePane] = useState<'all' | 'student' | 'staff' | 'tv'>('all');
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);

  const demoSteps = [
    {
      step: 1,
      title: 'Order Placed on Mobile',
      desc: 'Student Srijani places order for Hakka Noodles & Sandwich, assigned Token #A47.',
    },
    {
      step: 2,
      title: 'Real-time Kitchen Ingestion',
      desc: 'Chef Ramesh sees #A47 in the kitchen stream instantly with zero manual refresh.',
    },
    {
      step: 3,
      title: 'Chef Starts Cooking',
      desc: 'Chef clicks PREPARING. Mobile app immediately updates to 🟡 PREPARING.',
    },
    {
      step: 4,
      title: 'Food Ready Chime & Display',
      desc: 'Chef marks READY. Mobile sounds 🔔 alert and TV monitor flashes #A47 for pickup!',
    },
    {
      step: 5,
      title: 'Closed-Loop Operations',
      desc: 'Student collects tray & submits rating. Operations console logs wait-time accuracy.',
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Demo Controller Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                PRESENTATION LIVE DEMO
              </span>
              <span className="text-xs text-slate-400">Design Thinking Working Prototype</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              One Real-Time System · Three Perspectives
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Watch actions in the Staff Kitchen immediately update the Student Mobile App and Canteen TV Display across the shared real-time queue bus.
            </p>
          </div>

          {/* Master Fast Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {targetDemoOrder && (
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl">
                <span className="text-xs font-mono text-amber-400 font-bold px-2">
                  Demo Target: #{targetDemoOrder.tokenNumber} ({targetDemoOrder.status})
                </span>

                {targetDemoOrder.status === 'QUEUED' && (
                  <button
                    onClick={() => advanceOrderStatus(targetDemoOrder.id, 'PREPARING')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    Set PREPARING
                  </button>
                )}

                {targetDemoOrder.status === 'PREPARING' && (
                  <button
                    onClick={() => advanceOrderStatus(targetDemoOrder.id, 'READY')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all animate-pulse"
                  >
                    Set READY 🔔
                  </button>
                )}

                {targetDemoOrder.status === 'READY' && (
                  <button
                    onClick={() => advanceOrderStatus(targetDemoOrder.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Confirm Pickup
                  </button>
                )}
              </div>
            )}

            <button
              onClick={simulateLunchRush}
              className="px-4 py-2 bg-orange-600/30 hover:bg-orange-600/50 text-orange-400 border border-orange-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Flame className="w-4 h-4" />
              <span>Simulate Lunch Rush</span>
            </button>

            <button
              onClick={resetDemo}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700"
              title="Reset to clean initial queue state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guided Presentation Steps (Section 24) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Presentation Script</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {demoSteps.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentDemoStep(s.step)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  currentDemoStep === s.step
                    ? 'bg-amber-500/20 border-amber-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                  <span className={currentDemoStep === s.step ? 'text-amber-400' : 'text-slate-500'}>
                    STEP {s.step}
                  </span>
                  {currentDemoStep === s.step && <span className="text-amber-400">●</span>}
                </div>
                <div className="font-bold text-xs text-white">{s.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Presentation Philosophy Quote Banner */}
        <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-center text-xs font-medium text-slate-300">
          💬 <strong className="text-amber-400">“We didn't create three screens. We created one system with three perspectives.”</strong>
          <span className="text-slate-500 ml-2">— Srijani Bhandari, B.Tech CSE (AI/ML)</span>
        </div>
      </div>

      {/* Pane View Selector Tabs for Responsive/Presentation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Tri-Split View (All 3)', icon: SplitSquareVertical },
            { id: 'student', label: '1. Student View', icon: Smartphone },
            { id: 'staff', label: '2. Staff Kitchen', icon: ChefHat },
            { id: 'tv', label: '3. Canteen TV Monitor', icon: Monitor },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePane(tab.id as 'all' | 'student' | 'staff' | 'tv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activePane === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-500 hidden sm:block">
          Active Orders: <span className="text-amber-400 font-bold">{metrics.activeOrdersCount}</span> · Serving: <span className="text-emerald-400 font-bold">#{currentServingToken}</span>
        </div>
      </div>

      {/* THE MULTI-VIEW WORKSPACE */}
      {activePane === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 1. Student Mobile Frame (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Smartphone className="w-4 h-4" />
                <span>Perspective 1: Student Phone</span>
              </span>
              <span className="text-slate-500 font-mono">Mobile View</span>
            </div>
            <div className="max-h-[820px] overflow-y-auto pr-1 scrollbar-none">
              <StudentApp />
            </div>
          </div>

          {/* 2. Staff Kitchen Frame (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-orange-400">
                <ChefHat className="w-4 h-4" />
                <span>Perspective 2: Kitchen Staff Panel</span>
              </span>
              <span className="text-slate-500 font-mono">Prep Console</span>
            </div>
            <div className="max-h-[820px] overflow-y-auto pr-1 scrollbar-none">
              <StaffDashboard />
            </div>
          </div>

          {/* 3. Canteen TV Monitor Frame (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Monitor className="w-4 h-4" />
                <span>Perspective 3: Canteen TV Monitor</span>
              </span>
              <span className="text-slate-500 font-mono">Live Display</span>
            </div>
            <div className="max-h-[820px] overflow-y-auto pr-1 scrollbar-none">
              <CanteenTvDisplay />
            </div>
          </div>
        </div>
      ) : activePane === 'student' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <StudentApp />
        </div>
      ) : activePane === 'staff' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <StaffDashboard />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <CanteenTvDisplay />
        </div>
      )}
    </div>
  );
};
