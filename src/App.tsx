import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Navbar, AppView } from './components/Navbar';
import { StudentApp } from './components/StudentApp';
import { StaffDashboard } from './components/StaffDashboard';
import { CanteenTvDisplay } from './components/CanteenTvDisplay';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { LiveDemoSplitView } from './components/LiveDemoSplitView';
import { DesignThinkingSection } from './components/DesignThinkingSection';
import { QrPosterModal } from './components/QrPosterModal';
import { OfflineSimBanner } from './components/OfflineSimBanner';
import { UserRole } from './types/queue';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('student');
  const [isQrPosterOpen, setIsQrPosterOpen] = useState<boolean>(false);
  const { currentUser, switchRole, switchUser, users } = useQueue();

  const handleSimulateScan = () => {
    setCurrentView('student');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Offline Status & Local Cache Banner */}
      <OfflineSimBanner />

      {/* Top Navbar Contract */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onOpenQrPoster={() => setIsQrPosterOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'student' && <StudentApp />}
        {currentView === 'staff' && <StaffDashboard />}
        {currentView === 'canteen_tv' && <CanteenTvDisplay />}
        {currentView === 'admin' && <AdminCommandCenter />}
        {currentView === 'demo_split' && <LiveDemoSplitView />}
        {currentView === 'design_thinking' && <DesignThinkingSection />}
      </main>

      {/* QR Poster Modal */}
      <QrPosterModal
        isOpen={isQrPosterOpen}
        onClose={() => setIsQrPosterOpen(false)}
        onSimulateScan={handleSimulateScan}
      />

      {/* Footer with Role Switcher & Design Thinking Philosophy */}
      <footer className="bg-slate-900/90 border-t border-slate-800/80 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm tracking-tight">QUEUELESS</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400 font-semibold">Smart College Canteen Queue System</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xl">
              “Don't start by asking what technology can we use. Start by asking what problem is worth solving.”
              <br />
              Design Thinking Project by Srijani Bhandari · 1st-Year B.Tech CSE (AI/ML)
            </p>
          </div>

          {/* Quick Persona / Role Switcher for Evaluators */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[11px] text-slate-500">Active Persona:</span>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {users.map((u) => {
                const isCur = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      if (u.role === 'student') setCurrentView('student');
                      else if (u.role === 'staff') setCurrentView('staff');
                      else if (u.role === 'admin') setCurrentView('admin');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isCur
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {u.role === 'student' && '🎓 Srijani (Student)'}
                    {u.role === 'staff' && '👨‍🍳 Chef Ramesh (Staff)'}
                    {u.role === 'admin' && '📊 Prof. Verma (Admin)'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <MainLayout />
    </QueueProvider>
  );
}
