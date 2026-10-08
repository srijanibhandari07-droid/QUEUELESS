export type OrderStatus = 'QUEUED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type CongestionLevel = 'NORMAL' | 'BUSY' | 'CONGESTED';

export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  queueXP: number;
  level: number;
  avatar?: string;
  department?: string;
  year?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Fast Food' | 'Meals' | 'Beverages' | 'South Indian' | 'Snacks';
  price: number;
  prepTimeMinutes: number;
  available: boolean;
  calories?: number;
  description: string;
  isVeg: boolean;
  imageEmoji: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalPrice: number;
  tokenNumber: string; // e.g., 'A47'
  status: OrderStatus;
  createdAt: number; // timestamp ms
  startedPreparingAt?: number;
  readyAt?: number;
  completedAt?: number;
  estimatedWaitMinutes: number;
  actualWaitMinutes?: number;
  notes?: string;
  paymentMethod: 'Campus Pay' | 'UPI' | 'Cash on Pickup';
}

export interface QueueToken {
  tokenNumber: string;
  orderId: string;
  userName: string;
  itemsSummary: string;
  position: number;
  status: OrderStatus;
  estimatedWaitMinutes: number;
  createdAt: number;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  tokenNumber: string;
  rating: number; // 1 to 5
  waitTimeRating: 'Too long' | 'Okay' | 'Fast';
  comment: string;
  createdAt: number;
}

export interface PredictionPoint {
  orderId: string;
  tokenNumber: string;
  predictedMinutes: number;
  actualMinutes: number;
  errorMinutes: number;
  timestamp: number;
}

export interface QueueMetrics {
  totalOrders: number;
  activeOrdersCount: number;
  currentlyPreparingCount: number;
  readyForPickupCount: number;
  avgWaitTimeMinutes: number;
  kitchenLoadPercent: number;
  congestionLevel: CongestionLevel;
  customerSatisfaction: number;
  popularItems: { name: string; count: number }[];
  predictedVsActual: PredictionPoint[];
  currentServingToken: string;
}
