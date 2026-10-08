import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Flame,
  Star,
  Brain,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { predictionEngine } from '../services/predictionEngine';

export const AdminCommandCenter: React.FC = () => {
  const { metrics, orders, feedbacks, simulateLunchRush, resetDemo } = useQueue();
  const [showRoadmap, setShowRoadmap] = useState<boolean>(false);

  const mae = predictionEngine.calculateMAE(metrics.predictedVsActual);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">OPERATIONS COMMAND</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Campus Administration & Welfare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            QUEUELESS COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, predictive wait-time analytics & crowd congestion management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRoadmap(!showRoadmap)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{showRoadmap ? 'Hide Roadmap' : 'Platform Roadmap (V2-V7)'}</span>
          </button>

          <button
            onClick={resetDemo}
            title="Reset system to clean presentation baseline"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONGESTION DETECTION BANNER (Section 15) */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          metrics.congestionLevel === 'CONGESTED'
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
            : metrics.congestionLevel === 'BUSY'
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {metrics.congestionLevel === 'CONGESTED' && '🔴'}
            {metrics.congestionLevel === 'BUSY' && '🟡'}
            {metrics.congestionLevel === 'NORMAL' && '🟢'}
          </span>
          <div>
            <div className="font-extrabold text-sm sm:text-base">
              CANTEEN CONGESTION LEVEL: {metrics.congestionLevel}
            </div>
            <div className="text-xs opacity-80 mt-0.5">
              {metrics.congestionLevel === 'CONGESTED' &&
                'High crowd detected. Peak lunch rush active. Queues throttled.'}
              {metrics.congestionLevel === 'BUSY' &&
                'Moderate lunch flow. Counter 1 & 2 cooking in parallel.'}
              {metrics.congestionLevel === 'NORMAL' &&
                'Queue flowing smoothly. Minimal counter wait times.'}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right bg-black/20 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="block opacity-70">Recommended Pickup Window:</span>
          <span className="font-bold text-white">1:35 PM – 1:45 PM</span>
        </div>
      </div>

      {/* CORE TELEMETRY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Orders</span>
            <TrendingUp className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
            {metrics.totalOrders}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Session total</span>
        </div>

        {/* Card 2: Current Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Current Queue</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
            {metrics.activeOrdersCount}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Students in line</span>
        </div>

        {/* Card 3: Avg Wait */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Wait Time</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
            {metrics.avgWaitTimeMinutes} <span className="text-sm font-sans font-medium text-slate-400">min</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">-42% vs physical line</span>
        </div>

        {/* Card 4: Kitchen Load */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Kitchen Load</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-orange-400 tabular-nums">
            {metrics.kitchenLoadPercent}%
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics.kitchenLoadPercent}%` }}
            />
          </div>
        </div>

        {/* Card 5: Satisfaction */}
        <div className="col-span-2 lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Student Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
            {metrics.customerSatisfaction} <span className="text-sm font-sans font-medium text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {feedbacks.length} verified reviews
          </span>
        </div>
      </div>

      {/* SECTION: PREDICTION INTELLIGENCE & ACCURACY (Section 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ML Wait Prediction Model Accuracy (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-base">Wait-Time Prediction Model (AI/ML)</h3>
                <span className="text-xs text-slate-400">
                  Continuous learning loop recording predicted vs actual kitchen prep
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Mean Absolute Error</span>
              <span className="text-sm font-bold font-mono text-emerald-400">MAE: {mae} min</span>
            </div>
          </div>

          {/* Predictions comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-2">Token</th>
                  <th className="py-2">Predicted Wait</th>
                  <th className="py-2">Actual Wait</th>
                  <th className="py-2">Delta / Error</th>
                  <th className="py-2 text-right">Model Calibration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {metrics.predictedVsActual.slice(-6).map((point, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-amber-400">#{point.tokenNumber}</td>
                    <td className="py-2.5 text-slate-300">{point.predictedMinutes} min</td>
                    <td className="py-2.5 text-slate-300">{point.actualMinutes} min</td>
                    <td className="py-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          Math.abs(point.errorMinutes) <= 0.5
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {point.errorMinutes > 0 ? `+${point.errorMinutes}` : point.errorMinutes} min
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-400 text-[11px]">
                      Verified by Student Pickup
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Algorithm: Linear Wait Decomposition + Kitchen Load Weighting</span>
            <span className="font-mono text-amber-400">Dynamic Auto-tuning Active</span>
          </div>
        </div>

        {/* Popular Food Items Breakdown (Col 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Popular Canteen Items</h3>
              <span className="text-xs text-slate-400 font-mono">By Demand</span>
            </div>

            <div className="space-y-3">
              {metrics.popularItems.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="font-mono text-slate-400">{item.count} ordered</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.count / Math.max(1, metrics.popularItems[0].count)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Helps canteen staff pre-prep ingredients for peak lunch slots.
          </div>
        </div>
      </div>

      {/* SECTION: RECENT STUDENT FEEDBACK LOOP (Section 17) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Real-time Student Feedback Stream</h3>
            <p className="text-xs text-slate-400">
              Submitted after digital pickup confirmation. Automatically updates satisfaction metrics.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            Average: {metrics.customerSatisfaction} / 5.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {feedbacks.slice(0, 6).map((fb) => (
            <div key={fb.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white">{fb.userName}</span>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-300 italic mb-2">"{fb.comment}"</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                <span>Token #{fb.tokenNumber}</span>
                <span className="text-emerald-400">Wait: {fb.waitTimeRating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROADMAP MODAL / ACCORDION (Section 28) */}
      {showRoadmap && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Platform Expansion Roadmap (V2 – V7)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ver: 'V2', title: 'Predictive Queue Engine', desc: 'Recurrent Neural Network on semester rush logs to forecast wait times 24 hours in advance.' },
              { ver: 'V3', title: 'Multi-Counter Routing', desc: 'Parallel counter dispatch: Fast Beverage Express counter vs Hot Meals main counter.' },
              { ver: 'V4', title: 'Campus-wide Food Ordering', desc: 'Order from library or classroom 10 minutes before break bell rings.' },
              { ver: 'V5', title: 'Demand Forecasting', desc: 'Prevent canteen food wastage by predicting exact ingredient requirements per weekday.' },
              { ver: 'V6', title: 'Smart Inventory & Supplier Sync', desc: 'Automated stock replenishment alerts for milk, patties, and buns.' },
              { ver: 'V7', title: 'Multi-Campus Deployment', desc: 'One QUEUELESS platform connecting engineering, medical, and management campus canteens.' },
            ].map((item) => (
              <div key={item.ver} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {item.ver}
                </span>
                <h4 className="font-bold text-white text-sm mt-2">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
