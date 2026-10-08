import React from 'react';
import {
  Lightbulb,
  Eye,
  Heart,
  Target,
  Sparkles,
  Cpu,
  Repeat,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';

export const DesignThinkingSection: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'OBSERVE',
      subtitle: 'Field observations at Academic Block 4 Canteen (12:45 PM – 1:30 PM)',
      icon: Eye,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      findings: [
        'Over 400 students rush into the canteen within an 8-minute window after bell.',
        'Physical queues stretch 20+ meters across walkways, blocking stairs.',
        'Students repeatedly walk up to the counter asking: "Is my order ready yet?"',
        'Canteen staff is constantly interrupted while trying to plate hot food.',
      ],
      metric: '18 min wasted in line',
    },
    {
      step: '02',
      title: 'EMPATHIZE',
      subtitle: 'Understanding the student & staff emotional journey',
      icon: Heart,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      findings: [
        'Student Persona: Srijani Bhandari, 1st Year B.Tech CSE (AI/ML).',
        'Pain: Rushed to eat in 4 minutes to avoid missing 1:30 PM Data Structures lab.',
        'Staff Persona: Chef Ramesh Kumar, managing 3 cooking stations under blind order spikes.',
        'Core emotion: Helplessness caused by zero visibility into queue progress.',
      ],
      metric: '82% report break anxiety',
    },
    {
      step: '03',
      title: 'DEFINE',
      subtitle: 'Synthesizing the core problem worth solving',
      icon: Target,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      findings: [
        '“Unpredictable waiting is the core pain — not the food preparation itself.”',
        'Students do not mind waiting 6 minutes if they know exactly when to collect.',
        'Standing in a physical queue restricts students from sitting, studying, or socializing.',
        'Problem statement: How might we eliminate queue uncertainty without hiring extra staff?',
      ],
      metric: 'Uncertainty = Core Pain',
    },
    {
      step: '04',
      title: 'IDEATE',
      subtitle: 'Brainstorming radical operational transformations',
      icon: Lightbulb,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      findings: [
        'Shift from Physical Queue to Digital Queue: Physical line becomes optional.',
        'Digital Token Engine: Generate sequential tokens (A42, A43... A47) with live position.',
        'Predictive Wait-Time Engine: Combine item prep times + kitchen load + historical error logs.',
        'Canteen TV Monitor: Broadcast "Now Serving" and "Ready" tokens for 30-foot visibility.',
      ],
      metric: 'Zero Physical Queuing',
    },
    {
      step: '05',
      title: 'PROTOTYPE',
      subtitle: 'Building QUEUELESS: The multi-perspective real-time system',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      findings: [
        'Student Web App: QR scan, menu, digital token tracking, live status progress bar.',
        'Staff Kitchen Console: Stream of active tickets with 1-click status advancement.',
        'Canteen TV Monitor: High-contrast large-font display with audio chime notifications.',
        'Real-time State Synchronization: Instant updates across devices with no page refresh.',
      ],
      metric: '3-Perspective Architecture',
    },
    {
      step: '06',
      title: 'TEST & ITERATE',
      subtitle: 'Closed-loop data feedback and gamified tray returns',
      icon: Repeat,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      findings: [
        'Post-pickup feedback: Records actual vs predicted prep time to continuously train MAE.',
        'Queue XP Gamification: Awards +5 XP for returning trays, keeping pickup area tidy.',
        'Congestion intelligence: Detects peak rushes and recommends less crowded time windows.',
        'Offline reliability: Preserves active token in client cache if campus WiFi flickers.',
      ],
      metric: '4.8/5 Satisfaction',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>B.Tech CSE (AI/ML) · 1st Year Design Thinking Project</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          WHY WE BUILT <span className="text-amber-400">QUEUELESS</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mt-4 font-medium italic">
          “Don't start by asking what technology can we use. Start by asking what problem is worth solving.”
        </p>

        <p className="text-xs text-slate-400 max-w-2xl mx-auto mt-2">
          Designed by Srijani Bhandari & Team to solve campus cafeteria overcrowding, food wait anxiety, and kitchen bottlenecks through human-centered engineering.
        </p>
      </div>

      {/* The Big Idea Transformation Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-6 text-center">
          The Paradigm Shift: From Mandatory Physical Line to Digital Freedom
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old way */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-5">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block mb-2">
              Old Canteen Model (High Friction)
            </span>
            <div className="text-sm font-bold text-white space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">1</span>
                <span>Student arrives at break bell</span>
              </div>
              <div className="flex items-center gap-2 text-rose-300">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">2</span>
                <span>Stands in 20-minute physical line (wasted time)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">3</span>
                <span>Reaches counter, orders & pays</span>
              </div>
              <div className="flex items-center gap-2 text-rose-300">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">4</span>
                <span>Waits blindly in crowded counter area</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-rose-400 font-semibold">
              Result: Rushed eating, missed class, staff burnout.
            </div>
          </div>

          {/* New QUEUELESS way */}
          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-5">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              The QUEUELESS Model (Smart Queue)
            </span>
            <div className="text-sm font-bold text-white space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                <span>Scan QR code from desk, bench, or walkway</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                <span>Digital order placed, assigned Token #A47</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                <span>Student studies or sits with friends while timer ticks</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">4</span>
                <span>Phone chimes when READY: 30-second smooth pickup!</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-emerald-400 font-semibold">
              Result: Zero line standing. Students own their lunch break.
            </div>
          </div>
        </div>
      </div>

      {/* 6 Stages Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white text-center">
          The 6 Design Thinking Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-2xl font-black text-slate-600">{st.step}</span>
                    <div className={`p-2.5 rounded-2xl border ${st.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{st.subtitle}</p>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {st.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Key Metric:</span>
                  <span className="text-amber-400 font-bold">{st.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Statement */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center">
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          <strong className="text-white">“We didn't remove the queue. We removed the uncertainty around it.”</strong>
        </p>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          QUEUELESS · Department of Computer Science & Engineering (AI/ML)
        </p>
      </div>
    </div>
  );
};
