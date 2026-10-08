import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CartItem,
  Feedback,
  MenuItem,
  Order,
  OrderStatus,
  PredictionPoint,
  QueueMetrics,
  User,
  UserRole,
} from '../types/queue';
import {
  INITIAL_FEEDBACK,
  INITIAL_MENU,
  INITIAL_ORDERS,
  INITIAL_PREDICTIONS,
  INITIAL_USERS,
} from '../data/initialData';
import { soundService } from '../services/soundService';
import { predictionEngine } from '../services/predictionEngine';

interface QueueContextType {
  // Current user & authentication
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;

  // Menu items
  menu: MenuItem[];
  toggleItemAvailability: (itemId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Orders & Queue
  orders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  studentActiveOrder: Order | null;
  placeOrder: (notes?: string, paymentMethod?: 'Campus Pay' | 'UPI' | 'Cash on Pickup') => Order;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Real-time Queue stats
  currentServingToken: string;
  readyTokens: string[];
  metrics: QueueMetrics;

  // Gamification & Feedback
  feedbacks: Feedback[];
  submitFeedback: (rating: number, waitTimeRating: 'Too long' | 'Okay' | 'Fast', comment: string) => void;
  awardXP: (amount: number, reason: string) => void;
  recentXpReward: { amount: number; reason: string } | null;

  // Demo & Simulation
  simulateLunchRush: () => void;
  resetDemo: () => void;

  // Connectivity
  isOnline: boolean;
  toggleNetworkStatus: () => void;

  // Presentation Quick Actions
  soundEnabled: boolean;
  toggleSound: () => void;
  lastReadyAlert: string | null;
  dismissReadyAlert: () => void;
}

const STORAGE_KEYS = {
  ORDERS: 'queueless_orders_v1',
  MENU: 'queueless_menu_v1',
  USERS: 'queueless_users_v1',
  CURRENT_USER_ID: 'queueless_cur_user_v1',
  FEEDBACK: 'queueless_feedback_v1',
  PREDICTIONS: 'queueless_predictions_v1',
  TOKEN_SEQ: 'queueless_token_seq_v1',
};

const BROADCAST_CHANNEL_NAME = 'queueless_sync_channel';

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // BroadcastChannel for instant cross-tab sync
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Core state with local storage fallback
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_srijani';
    } catch {
      return 'user_srijani';
    }
  });

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return saved ? JSON.parse(saved) : INITIAL_MENU;
    } catch {
      return INITIAL_MENU;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
    } catch {
      return INITIAL_FEEDBACK;
    }
  });

  const [predictions, setPredictions] = useState<PredictionPoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
      return saved ? JSON.parse(saved) : INITIAL_PREDICTIONS;
    } catch {
      return INITIAL_PREDICTIONS;
    }
  });

  const [tokenCounter, setTokenCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOKEN_SEQ);
      return saved ? parseInt(saved, 10) : 47; // Default next token is A47!
    } catch {
      return 47;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastReadyAlert, setLastReadyAlert] = useState<string | null>(null);
  const [recentXpReward, setRecentXpReward] = useState<{ amount: number; reason: string } | null>(null);

  // Initialize BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      setBroadcastChannel(channel);

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_ALL') {
          if (payload.orders) setOrders(payload.orders);
          if (payload.menu) setMenu(payload.menu);
          if (payload.feedbacks) setFeedbacks(payload.feedbacks);
          if (payload.predictions) setPredictions(payload.predictions);
          if (payload.tokenCounter) setTokenCounter(payload.tokenCounter);
          if (payload.users) setUsers(payload.users);
        } else if (type === 'ORDER_READY_NOTIFY') {
          soundService.playOrderReadyChime();
          setLastReadyAlert(payload.tokenNumber);
        }
      };
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Broadcast state updates helper
  const broadcastSync = useCallback(
    (newOrders: Order[], newMenu: MenuItem[], newFeedbacks: Feedback[], newPredictions: PredictionPoint[], newUsers: User[], newSeq: number) => {
      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'SYNC_ALL',
          payload: {
            orders: newOrders,
            menu: newMenu,
            feedbacks: newFeedbacks,
            predictions: newPredictions,
            users: newUsers,
            tokenCounter: newSeq,
          },
        });
      }
    },
    [broadcastChannel]
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
      localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, tokenCounter.toString());
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch {}
  }, [orders, menu, feedbacks, predictions, users, tokenCounter, currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const switchUser = useCallback((userId: string) => {
    setCurrentUserId(userId);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
    }
  }, [users]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundService.setSoundEnabled(next);
      return next;
    });
  }, []);

  const dismissReadyAlert = useCallback(() => {
    setLastReadyAlert(null);
  }, []);

  // Menu items availability toggle
  const toggleItemAvailability = useCallback(
    (itemId: string) => {
      setMenu((prev) => {
        const next = prev.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m));
        broadcastSync(orders, next, feedbacks, predictions, users, tokenCounter);
        return next;
      });
    },
    [orders, feedbacks, predictions, users, tokenCounter, broadcastSync]
  );

  // Cart operations
  const addToCart = useCallback((item: MenuItem) => {
    if (!item.available) return;
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) => (ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Derived order subsets
  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'QUEUED' || o.status === 'PREPARING');
  }, [orders]);

  const readyOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'READY');
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'COMPLETED');
  }, [orders]);

  // Student's most recent active or ready order
  const studentActiveOrder = useMemo(() => {
    return (
      orders.find(
        (o) =>
          o.userId === currentUser.id &&
          (o.status === 'QUEUED' || o.status === 'PREPARING' || o.status === 'READY')
      ) || null
    );
  }, [orders, currentUser.id]);

  // Currently serving token (lowest token among PREPARING, or highest READY)
  const currentServingToken = useMemo(() => {
    const preparing = orders.filter((o) => o.status === 'PREPARING');
    if (preparing.length > 0) {
      return preparing[0].tokenNumber;
    }
    const queued = orders.filter((o) => o.status === 'QUEUED');
    if (queued.length > 0) {
      return queued[0].tokenNumber;
    }
    return readyOrders.length > 0 ? readyOrders[0].tokenNumber : 'A42';
  }, [orders, readyOrders]);

  const readyTokens = useMemo(() => {
    return readyOrders.map((o) => o.tokenNumber);
  }, [readyOrders]);

  // Award XP and Gamification
  const awardXP = useCallback(
    (amount: number, reason: string) => {
      soundService.playXpEarned();
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      setRecentXpReward({ amount, reason });
      setTimeout(() => setRecentXpReward(null), 4000);

      setUsers((prev) => {
        const next = prev.map((u) => {
          if (u.id === currentUser.id) {
            const nextXP = u.queueXP + amount;
            const nextLevel = Math.floor(nextXP / 100) + 1;
            return { ...u, queueXP: nextXP, level: nextLevel };
          }
          return u;
        });
        return next;
      });
    },
    [currentUser.id]
  );

  // Submit Feedback Loop
  const submitFeedback = useCallback(
    (rating: number, waitTimeRating: 'Too long' | 'Okay' | 'Fast', comment: string) => {
      const orderToReview = orders.find(
        (o) => o.userId === currentUser.id && (o.status === 'READY' || o.status === 'COMPLETED')
      );
      const tokenNumber = orderToReview ? orderToReview.tokenNumber : 'A47';
      const orderId = orderToReview ? orderToReview.id : `order_${Date.now()}`;

      const newFeedback: Feedback = {
        id: `fb_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        orderId,
        tokenNumber,
        rating,
        waitTimeRating,
        comment: comment.trim() || 'Food was delicious and collected on time!',
        createdAt: Date.now(),
      };

      const updatedFeedbacks = [newFeedback, ...feedbacks];
      setFeedbacks(updatedFeedbacks);

      // Award +5 XP for feedback
      awardXP(5, 'Helpful Canteen Feedback');

      broadcastSync(orders, menu, updatedFeedbacks, predictions, users, tokenCounter);
    },
    [orders, currentUser, feedbacks, predictions, menu, users, tokenCounter, broadcastSync, awardXP]
  );

  // Place Order (Backend token generation & wait prediction)
  const placeOrder = useCallback(
    (notes?: string, paymentMethod: 'Campus Pay' | 'UPI' | 'Cash on Pickup' = 'Campus Pay'): Order => {
      const nextSeq = tokenCounter;
      const tokenNumber = `A${nextSeq}`;
      const newSeq = tokenCounter + 1;
      setTokenCounter(newSeq);

      // Prediction engine calculates wait time
      const itemsToOrder = cart.length > 0 ? [...cart] : [{ menuItem: menu[0], quantity: 1 }];
      const pred = predictionEngine.predictWaitTime(itemsToOrder, activeOrders, tokenNumber);

      const totalPrice = itemsToOrder.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);

      const newOrder: Order = {
        id: `order_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        items: itemsToOrder,
        totalPrice,
        tokenNumber,
        status: 'QUEUED',
        createdAt: Date.now(),
        estimatedWaitMinutes: pred.predictedMinutes,
        notes,
        paymentMethod,
      };

      const nextOrders = [...orders, newOrder];
      setOrders(nextOrders);
      setCart([]);

      soundService.playOrderPlaced();

      // Broadcast to other tabs & screens
      broadcastSync(nextOrders, menu, feedbacks, predictions, users, newSeq);

      return newOrder;
    },
    [tokenCounter, cart, menu, activeOrders, currentUser, orders, feedbacks, predictions, users, broadcastSync]
  );

  // Advance Order Status (QUEUED -> PREPARING -> READY -> COMPLETED)
  const advanceOrderStatus = useCallback(
    (orderId: string, nextStatus: OrderStatus) => {
      const now = Date.now();
      let updatedPredictions = [...predictions];
      let readyTokenNum: string | null = null;

      const nextOrders = orders.map((order) => {
        if (order.id !== orderId) return order;

        const updated = { ...order, status: nextStatus };

        if (nextStatus === 'PREPARING' && !order.startedPreparingAt) {
          updated.startedPreparingAt = now;
        } else if (nextStatus === 'READY') {
          updated.readyAt = now;
          readyTokenNum = order.tokenNumber;

          // Prediction Learning Engine: compare actual vs predicted
          const elapsedMinutes = Number(((now - order.createdAt) / 60000).toFixed(1));
          updated.actualWaitMinutes = elapsedMinutes;

          const error = Number((elapsedMinutes - order.estimatedWaitMinutes).toFixed(1));
          const point: PredictionPoint = {
            orderId: order.id,
            tokenNumber: order.tokenNumber,
            predictedMinutes: order.estimatedWaitMinutes,
            actualMinutes: elapsedMinutes,
            errorMinutes: error,
            timestamp: now,
          };
          updatedPredictions = [...updatedPredictions, point];
          predictionEngine.recalibrateBias(updatedPredictions);
        } else if (nextStatus === 'COMPLETED') {
          updated.completedAt = now;
        }

        return updated;
      });

      setOrders(nextOrders);
      setPredictions(updatedPredictions);

      if (readyTokenNum) {
        soundService.playOrderReadyChime();
        setLastReadyAlert(readyTokenNum);
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'ORDER_READY_NOTIFY',
            payload: { tokenNumber: readyTokenNum },
          });
        }
      }

      broadcastSync(nextOrders, menu, feedbacks, updatedPredictions, users, tokenCounter);
    },
    [orders, predictions, broadcastChannel, broadcastSync, menu, feedbacks, users, tokenCounter]
  );

  // Cancel order
  const cancelOrder = useCallback(
    (orderId: string) => {
      const nextOrders = orders.map((o) => (o.id === orderId && o.status === 'QUEUED' ? { ...o, status: 'CANCELLED' as OrderStatus } : o));
      setOrders(nextOrders);
      broadcastSync(nextOrders, menu, feedbacks, predictions, users, tokenCounter);
    },
    [orders, menu, feedbacks, predictions, users, tokenCounter, broadcastSync]
  );

  // Simulate Lunch Rush ("WOW MOMENT")
  const simulateLunchRush = useCallback(() => {
    let curSeq = tokenCounter;
    const names = [
      { name: 'Rohan Mehra', item: menu[0] },
      { name: 'Ananya Sen', item: menu[1] },
      { name: 'Kabir Singhania', item: menu[4] },
      { name: 'Priya Iyer', item: menu[3] },
      { name: 'Devansh Roy', item: menu[5] },
      { name: 'Meera Nambiar', item: menu[2] },
      { name: 'Aditya Gupta', item: menu[7] },
    ];

    const newSimulatedOrders: Order[] = names.map((n, idx) => {
      const token = `A${curSeq + idx}`;
      return {
        id: `sim_order_${Date.now()}_${idx}`,
        userId: `user_sim_${idx}`,
        userName: n.name,
        items: [{ menuItem: n.item, quantity: 1 }],
        totalPrice: n.item.price,
        tokenNumber: token,
        status: idx < 2 ? 'PREPARING' : 'QUEUED',
        createdAt: Date.now() - (idx * 60000),
        estimatedWaitMinutes: 12 + idx * 2,
        paymentMethod: idx % 2 === 0 ? 'UPI' : 'Campus Pay',
      };
    });

    const newSeq = curSeq + names.length;
    setTokenCounter(newSeq);

    const merged = [...orders, ...newSimulatedOrders];
    setOrders(merged);

    soundService.playOrderPlaced();

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {}

    broadcastSync(merged, menu, feedbacks, predictions, users, newSeq);
  }, [tokenCounter, menu, orders, feedbacks, predictions, users, broadcastSync]);

  // Reset Demo to pristine state
  const resetDemo = useCallback(() => {
    setOrders(INITIAL_ORDERS);
    setMenu(INITIAL_MENU);
    setFeedbacks(INITIAL_FEEDBACK);
    setPredictions(INITIAL_PREDICTIONS);
    setUsers(INITIAL_USERS);
    setTokenCounter(47);
    setCurrentUserId('user_srijani');
    setCart([]);
    setLastReadyAlert(null);

    broadcastSync(INITIAL_ORDERS, INITIAL_MENU, INITIAL_FEEDBACK, INITIAL_PREDICTIONS, INITIAL_USERS, 47);
  }, [broadcastSync]);

  // Network offline simulation
  const toggleNetworkStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  // Compute Analytics Metrics
  const metrics = useMemo((): QueueMetrics => {
    const active = orders.filter((o) => o.status === 'QUEUED' || o.status === 'PREPARING');
    const preparing = orders.filter((o) => o.status === 'PREPARING');
    const ready = orders.filter((o) => o.status === 'READY');

    // Popular items
    const itemCounts: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        itemCounts[it.menuItem.name] = (itemCounts[it.menuItem.name] || 0) + it.quantity;
      });
    });
    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Customer satisfaction
    const avgRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1))
        : 4.8;

    // Kitchen load percentage (0 - 100)
    // 8 active orders is considered ~100% capacity for 2 cooking stations
    const kitchenLoad = Math.min(100, Math.round((active.length / 10) * 100));

    // Average wait time
    const completed = orders.filter((o) => o.actualWaitMinutes);
    const avgWait =
      completed.length > 0
        ? Number((completed.reduce((sum, o) => sum + (o.actualWaitMinutes || 0), 0) / completed.length).toFixed(1))
        : 7.2;

    const congestion = predictionEngine.calculateCongestionLevel(active.length);

    return {
      totalOrders: orders.length,
      activeOrdersCount: active.length,
      currentlyPreparingCount: preparing.length,
      readyForPickupCount: ready.length,
      avgWaitTimeMinutes: avgWait,
      kitchenLoadPercent: kitchenLoad,
      congestionLevel: congestion,
      customerSatisfaction: avgRating,
      popularItems,
      predictedVsActual: predictions,
      currentServingToken,
    };
  }, [orders, feedbacks, predictions, currentServingToken]);

  const value = {
    currentUser,
    users,
    switchUser,
    switchRole,
    menu,
    toggleItemAvailability,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    orders,
    activeOrders,
    completedOrders,
    studentActiveOrder,
    placeOrder,
    advanceOrderStatus,
    cancelOrder,
    currentServingToken,
    readyTokens,
    metrics,
    feedbacks,
    submitFeedback,
    awardXP,
    recentXpReward,
    simulateLunchRush,
    resetDemo,
    isOnline,
    toggleNetworkStatus,
    soundEnabled,
    toggleSound,
    lastReadyAlert,
    dismissReadyAlert,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
