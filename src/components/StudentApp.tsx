import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  ThumbsUp,
  Award,
  Layers,
  Utensils,
  History,
  Info,
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { MenuItem } from '../types/queue';
import { predictionEngine } from '../services/predictionEngine';

export const StudentApp: React.FC = () => {
  const {
    currentUser,
    menu,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    studentActiveOrder,
    placeOrder,
    cancelOrder,
    advanceOrderStatus,
    currentServingToken,
    activeOrders,
    completedOrders,
    submitFeedback,
    awardXP,
    recentXpReward,
  } = useQueue();

  // Navigation tab inside Student view
  const [activeTab, setActiveTab] = useState<'tracker' | 'menu' | 'history'>('tracker');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'Campus Pay' | 'UPI' | 'Cash on Pickup'>('Campus Pay');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Post-pickup Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackWaitRating, setFeedbackWaitRating] = useState<'Too long' | 'Okay' | 'Fast'>('Fast');
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  // Countdown timer simulation for active order
  const [countdownSeconds, setCountdownSeconds] = useState<number>(360);

  useEffect(() => {
    if (!studentActiveOrder) return;
    // Set initial countdown seconds based on estimated wait minutes
    const estSec = studentActiveOrder.estimatedWaitMinutes * 60;
    const elapsedSec = Math.floor((Date.now() - studentActiveOrder.createdAt) / 1000);
    const remain = Math.max(0, estSec - elapsedSec);
    setCountdownSeconds(remain);

    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [studentActiveOrder]);

  // Calculate live people ahead for current order
  const peopleAhead = React.useMemo(() => {
    if (!studentActiveOrder) return 0;
    const myIndex = activeOrders.findIndex((o) => o.tokenNumber === studentActiveOrder.tokenNumber);
    return myIndex >= 0 ? myIndex : 0;
  }, [studentActiveOrder, activeOrders]);

  // Categories
  const categories = ['All', 'Fast Food', 'Snacks', 'South Indian', 'Meals', 'Beverages'];

  const filteredMenu = menu.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !onlyVeg || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  // Calculate pre-order wait estimate
  const preOrderPrediction = React.useMemo(() => {
    return predictionEngine.predictWaitTime(
      cart.length > 0 ? cart : [{ menuItem: menu[0], quantity: 1 }],
      activeOrders
    );
  }, [cart, menu, activeOrders]);

  // Format seconds into MM:SS
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    placeOrder(orderNotes, paymentMethod);
    setIsCartOpen(false);
    setActiveTab('tracker');
    setOrderNotes('');
  };

  const handleCompletePickup = () => {
    if (!studentActiveOrder) return;
    advanceOrderStatus(studentActiveOrder.id, 'COMPLETED');
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(feedbackRating, feedbackWaitRating, feedbackComment);
    setShowFeedbackModal(false);
    setFeedbackComment('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* XP Toast Notification */}
      {recentXpReward && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold animate-bounce">
          <Sparkles className="w-5 h-5" />
          <div>
            <div className="text-sm">+{recentXpReward.amount} Queue XP Earned!</div>
            <div className="text-xs font-medium opacity-90">{recentXpReward.reason}</div>
          </div>
        </div>
      )}

      {/* Student Welcome & Gamification Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span>{currentUser.department}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.year}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Good afternoon, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central Canteen · Academic Block 4 · Live Queue Active
          </p>
        </div>

        {/* Queue XP Level Badge & Actions */}
        <div className="w-full md:w-auto bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Level {currentUser.level}
              </span>
              <span className="font-mono text-slate-400">
                {currentUser.queueXP % 100} / 100 XP
              </span>
            </div>
            <div className="w-44 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentUser.queueXP % 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
            <button
              onClick={() => awardXP(5, 'Returned tray to dishwasher counter')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Earn 5 XP for returning dining tray"
            >
              +5 Tray Return
            </button>
            <button
              onClick={() => awardXP(10, 'Reported canteen pickup area clean')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Earn 10 XP for keeping line tidy"
            >
              +10 Keep Area Clean
            </button>
          </div>
        </div>
      </div>

      {/* Student Nav Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'tracker'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Token</span>
          {studentActiveOrder && (
            <span className="ml-1 bg-slate-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-mono">
              {studentActiveOrder.tokenNumber}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'menu'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Canteen Menu</span>
          {cartItemCount > 0 && (
            <span className="ml-1 bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-mono">
              {cartItemCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>My Orders</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE ORDER TRACKER */}
      {activeTab === 'tracker' && (
        <div>
          {studentActiveOrder ? (
            <div className="space-y-6">
              {/* Ready Alert Banner */}
              {studentActiveOrder.status === 'READY' && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/30 rounded-xl">
                      <CheckCircle2 className="w-7 h-7 text-slate-950" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold">YOUR FOOD IS READY FOR PICKUP!</h3>
                      <p className="text-xs font-semibold text-slate-900 mt-0.5">
                        Please head to Canteen Counter 2 with Token #{studentActiveOrder.tokenNumber}.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCompletePickup}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-950 text-white hover:bg-slate-900 font-bold rounded-xl text-sm transition-transform active:scale-95 whitespace-nowrap"
                  >
                    Confirm Pickup & Review
                  </button>
                </div>
              )}

              {/* Main Digital Token Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-mono text-slate-500">
                      Digital Queue Token
                    </span>
                    <div className="text-5xl sm:text-7xl font-extrabold font-mono tracking-tight text-white mt-1">
                      #{studentActiveOrder.tokenNumber}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <div className="text-xs text-slate-400 font-medium">Now Serving at Counter</div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 mt-0.5">
                      #{currentServingToken}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      People ahead of you:{' '}
                      <strong className="text-slate-200 font-mono text-sm">{peopleAhead}</strong>
                    </div>
                  </div>
                </div>

                {/* Status Stepper */}
                <div className="py-6 border-b border-slate-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Preparation Pipeline
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        studentActiveOrder.status === 'READY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : studentActiveOrder.status === 'PREPARING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {studentActiveOrder.status === 'READY' && '🟢 READY FOR PICKUP'}
                      {studentActiveOrder.status === 'PREPARING' && '🟡 PREPARING IN KITCHEN'}
                      {studentActiveOrder.status === 'QUEUED' && '🔵 QUEUED IN SYSTEM'}
                    </span>
                  </div>

                  {/* Visual Step Progress Bar */}
                  <div className="relative flex items-center justify-between text-xs font-semibold">
                    {/* Track line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-amber-400 -translate-y-1/2 z-0 transition-all duration-700"
                      style={{
                        width:
                          studentActiveOrder.status === 'READY'
                            ? '100%'
                            : studentActiveOrder.status === 'PREPARING'
                            ? '66%'
                            : '33%',
                      }}
                    />

                    {/* Step 1: Queued */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                        1
                      </div>
                      <span className="text-slate-300 mt-2">Queued</span>
                    </div>

                    {/* Step 2: Preparing */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          studentActiveOrder.status === 'PREPARING' || studentActiveOrder.status === 'READY'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        2
                      </div>
                      <span
                        className={`mt-2 ${
                          studentActiveOrder.status === 'PREPARING' || studentActiveOrder.status === 'READY'
                            ? 'text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        Preparing
                      </span>
                    </div>

                    {/* Step 3: Ready */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          studentActiveOrder.status === 'READY'
                            ? 'bg-emerald-400 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        3
                      </div>
                      <span
                        className={`mt-2 ${
                          studentActiveOrder.status === 'READY' ? 'text-emerald-400 font-bold' : 'text-slate-500'
                        }`}
                      >
                        Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Queue Progress Strip: A42 -> A43 -> ... -> A47 */}
                <div className="py-4 border-b border-slate-800/80">
                  <div className="text-xs text-slate-400 mb-2">Live Token Sequence:</div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
                    {activeOrders.slice(0, 8).map((o) => {
                      const isMine = o.tokenNumber === studentActiveOrder.tokenNumber;
                      const isServing = o.tokenNumber === currentServingToken;
                      return (
                        <span
                          key={o.id}
                          className={`px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                            isMine
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 ring-2 ring-amber-400/30'
                              : isServing
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
                          }`}
                        >
                          #{o.tokenNumber} {isMine && '(YOU)'} {isServing && '(NOW)'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Wait Time Countdown & AI Prediction Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Estimated Wait</span>
                    <div className="text-3xl font-extrabold font-mono text-white mt-1 tabular-nums">
                      {studentActiveOrder.status === 'READY' ? '00:00' : formatTime(countdownSeconds)}
                    </div>
                    <span className="text-[11px] text-slate-500">Live countdown</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">AI Predicted Time</span>
                    <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
                      {studentActiveOrder.estimatedWaitMinutes} min
                    </div>
                    <span className="text-[11px] text-slate-500">Based on kitchen load</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <span className="text-xs text-slate-400">Items Ordered</span>
                    <div className="text-lg font-bold text-white mt-1 truncate">
                      {studentActiveOrder.items.map((i) => `${i.menuItem.name} (${i.quantity})`).join(', ')}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ₹{studentActiveOrder.totalPrice} · {studentActiveOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Cancel option if still queued */}
                {studentActiveOrder.status === 'QUEUED' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => cancelOrder(studentActiveOrder.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium underline"
                    >
                      Cancel this order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty state when student has no active order */
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Utensils className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">No Active Token</h2>
              <p className="text-sm text-slate-400 mt-2 mb-6">
                You do not have a live canteen order. Browse today’s menu to place your digital order, get a token, and skip the physical queue!
              </p>
              <button
                onClick={() => setActiveTab('menu')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg flex items-center gap-2 mx-auto"
              >
                <span>Browse Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU & CART */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Search, Categories, and Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Hakka Noodles, Burger, Cold Coffee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg filter toggle */}
            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                onlyVeg
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Pure Veg Only</span>
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map((item) => {
              const inCart = cart.find((ci) => ci.menuItem.id === item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                    item.available
                      ? 'border-slate-800 hover:border-slate-700 shadow-sm'
                      : 'border-slate-800/50 opacity-60 bg-slate-950/40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl p-1 bg-slate-800/60 rounded-xl">{item.imageEmoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <h3 className="font-bold text-white text-sm">{item.name}</h3>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ⏱️ {item.prepTimeMinutes} min prep · {item.calories} cal
                          </span>
                        </div>
                      </div>
                      <span className="text-base font-extrabold font-mono text-amber-400">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                  </div>

                  {/* Add to cart / Quantity control */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {item.available ? (
                        <span className="text-emerald-400">Available</span>
                      ) : (
                        <span className="text-rose-400">Currently Sold Out</span>
                      )}
                    </span>

                    {item.available && (
                      <div>
                        {inCart ? (
                          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="p-1 text-slate-300 hover:text-white"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white px-1">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="p-1 text-slate-300 hover:text-white"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Cart Drawer Button */}
          {cartItemCount > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in Cart
                  </div>
                  <div className="text-xs font-mono text-amber-400">Total: ₹{cartTotal}</div>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1"
              >
                <span>View Cart & Order</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="text-sm font-bold text-slate-300">Your Past Canteen Orders</div>
          {completedOrders.length > 0 ? (
            <div className="space-y-3">
              {completedOrders.map((o) => (
                <div
                  key={o.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">#{o.tokenNumber}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                        Collected
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 mt-1">
                      {o.items.map((i) => `${i.menuItem.name} (${i.quantity})`).join(', ')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Wait time: {o.actualWaitMinutes || o.estimatedWaitMinutes} min · {o.paymentMethod}
                    </div>
                  </div>
                  <div className="text-base font-extrabold font-mono text-white">
                    ₹{o.totalPrice}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">No completed orders yet.</div>
          )}
        </div>
      )}

      {/* CART MODAL / SLIDEOVER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Your Order Review</span>
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="py-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center justify-between py-2 border-b border-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.menuItem.imageEmoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.menuItem.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">
                        ₹{item.menuItem.price} × {item.quantity} = ₹{item.menuItem.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQuantity(item.menuItem.id, -1)}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.menuItem.id, 1)}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Wait Time Estimate Preview Before Placing */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Queue Intelligence Estimate:</span>
                <span className="text-amber-400 font-bold font-mono">
                  ~{preOrderPrediction.predictedMinutes} min wait
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
                <span>Orders currently ahead in kitchen:</span>
                <span className="font-mono">{preOrderPrediction.peopleAheadCount} orders</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Campus Pay', 'UPI', 'Cash on Pickup'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      paymentMethod === method
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Kitchen Notes */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 mb-1 block">
                Special Requests (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Less spicy, extra sauce"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Total and Checkout CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">To Pay</span>
                <div className="text-2xl font-extrabold font-mono text-white">₹{cartTotal}</div>
              </div>

              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>Get Digital Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL (Post-Pickup Feedback Loop) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">How was your experience?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your feedback trains our smart wait-time model & earns +5 Queue XP!
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Overall Experience</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`p-1.5 transition-transform hover:scale-110 ${
                        star <= feedbackRating ? 'text-amber-400' : 'text-slate-700'
                      }`}
                    >
                      <Star className="w-7 h-7 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Wait Time Satisfaction */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">
                  How was the waiting time?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Too long', 'Okay', 'Fast'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedbackWaitRating(opt)}
                      className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        feedbackWaitRating === opt
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Comment */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">
                  Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pickup was butter smooth, noodles were hot!"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  Submit & Earn +5 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
