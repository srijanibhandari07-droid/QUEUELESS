import React, { useState } from 'react';
import {
  ChefHat,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  AlertTriangle,
  Flame,
  Check,
  X,
  SlidersHorizontal,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { OrderStatus } from '../types/queue';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    orders,
    menu,
    toggleItemAvailability,
    advanceOrderStatus,
    cancelOrder,
    currentServingToken,
    metrics,
    simulateLunchRush,
  } = useQueue();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu_manage'>('orders');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate kitchen load badge
  const getCongestionBadge = () => {
    switch (metrics.congestionLevel) {
      case 'NORMAL':
        return <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">🟢 NORMAL (Kitchen Stable)</span>;
      case 'BUSY':
        return <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">🟡 BUSY (High Order Inflow)</span>;
      case 'CONGESTED':
        return <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg animate-pulse">🔴 CONGESTED (Rush In Effect)</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Staff Kitchen Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">CANTEEN STAFF CONSOLE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-amber-400 font-semibold">Central Canteen</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              Kitchen Preparation Stream
            </h1>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl text-left">
            <span className="text-[11px] text-slate-400 block">Current Serving</span>
            <span className="text-xl font-bold font-mono text-amber-400">#{currentServingToken}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl text-left">
            <span className="text-[11px] text-slate-400 block">Active In Kitchen</span>
            <span className="text-xl font-bold font-mono text-white">
              {metrics.activeOrdersCount} orders
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl text-left">
            <span className="text-[11px] text-slate-400 block">Kitchen Load</span>
            <span className="text-xl font-bold font-mono text-white">{metrics.kitchenLoadPercent}%</span>
          </div>

          <div>{getCongestionBadge()}</div>
        </div>
      </div>

      {/* Primary Section Switcher */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Active Orders Stream ({metrics.activeOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('menu_manage')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'menu_manage'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Menu Availability ({menu.filter((m) => m.available).length} / {menu.length})
          </button>
        </div>

        {/* Quick Rush Simulation for Demo */}
        <button
          onClick={simulateLunchRush}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold transition-colors"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Simulate Rush Orders</span>
        </button>
      </div>

      {/* VIEW 1: ORDERS STREAM */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by token (e.g. A47) or student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(['ALL', 'QUEUED', 'PREPARING', 'READY', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-slate-200 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Stream Cards */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const elapsedMin = Math.floor((Date.now() - order.createdAt) / 60000);
                return (
                  <div
                    key={order.id}
                    className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all ${
                      order.status === 'READY'
                        ? 'border-emerald-500/50 shadow-emerald-500/5 bg-slate-900/90'
                        : order.status === 'PREPARING'
                        ? 'border-amber-500/50 shadow-amber-500/5 bg-slate-900/90'
                        : order.status === 'QUEUED'
                        ? 'border-blue-500/30 bg-slate-900/80'
                        : 'border-slate-800/60 opacity-60 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Token, Student, Time */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-extrabold text-2xl shadow-inner ${
                            order.status === 'READY'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : order.status === 'PREPARING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : order.status === 'QUEUED'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-sans tracking-wider font-semibold opacity-70">
                            TOKEN
                          </span>
                          <span>{order.tokenNumber}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{order.userName}</h3>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs font-mono text-slate-400">
                              {elapsedMin}m ago
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === 'READY'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : order.status === 'PREPARING'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : order.status === 'QUEUED'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          {/* Items Ordered List */}
                          <div className="text-sm font-medium text-slate-200 mt-1">
                            {order.items.map((i, idx) => (
                              <span key={idx} className="mr-3">
                                <strong>{i.quantity}×</strong> {i.menuItem.name}
                              </span>
                            ))}
                          </div>

                          {/* Order Details: notes, payment, predicted */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono">
                            <span>₹{order.totalPrice}</span>
                            <span aria-hidden="true">·</span>
                            <span>{order.paymentMethod}</span>
                            <span aria-hidden="true">·</span>
                            <span>Est: {order.estimatedWaitMinutes} min</span>
                            {order.notes && (
                              <span className="text-amber-300 font-sans font-medium bg-amber-500/10 px-1.5 py-0.5 rounded">
                                Note: {order.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Instant Staff Action Pipeline */}
                      <div className="flex items-center gap-2 self-end lg:self-center">
                        {/* QUEUED -> PREPARING */}
                        {order.status === 'QUEUED' && (
                          <button
                            onClick={() => advanceOrderStatus(order.id, 'PREPARING')}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Start Preparing</span>
                          </button>
                        )}

                        {/* PREPARING -> READY */}
                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => advanceOrderStatus(order.id, 'READY')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 ring-2 ring-emerald-400/40 animate-pulse"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Mark Ready (Notify Student)</span>
                          </button>
                        )}

                        {/* READY -> COMPLETED */}
                        {order.status === 'READY' && (
                          <button
                            onClick={() => advanceOrderStatus(order.id, 'COMPLETED')}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark Picked Up</span>
                          </button>
                        )}

                        {/* Cancel Button */}
                        {order.status === 'QUEUED' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Cancel Order"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 text-sm">
                No orders match your filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CANTEEN MENU AVAILABILITY CONTROLS */}
      {activeTab === 'menu_manage' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-1">
              Live Stock & Inventory Control
            </h3>
            <p className="text-xs text-slate-400">
              Pause unavailable food items when ingredients run out. Students’ menu updates immediately across all screens without reloading.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {menu.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1 bg-slate-800 rounded-xl">{item.imageEmoji}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className="text-xs font-mono text-slate-400">
                      ₹{item.price} · {item.prepTimeMinutes}m prep
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                    item.available
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                >
                  {item.available ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
