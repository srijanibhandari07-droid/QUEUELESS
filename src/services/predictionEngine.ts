import { CartItem, CongestionLevel, Order, PredictionPoint } from '../types/queue';

export interface WaitTimePredictionResult {
  predictedMinutes: number;
  peopleAheadCount: number;
  avgItemPrepTime: number;
  kitchenLoadMultiplier: number;
  confidenceScore: number; // 0 - 100
  recommendedWindowText?: string;
  congestionLevel: CongestionLevel;
}

export class PredictionEngine {
  // Adaptive bias learned from historical error differences
  private learnedBiasMinutes: number = 0;

  constructor() {
    this.recalibrateBias([]);
  }

  // Recalibrate based on recent historical predictions vs actual
  public recalibrateBias(predictions: PredictionPoint[]): number {
    if (!predictions || predictions.length === 0) {
      this.learnedBiasMinutes = -0.3; // Slight default historical offset
      return this.learnedBiasMinutes;
    }
    // Calculate mean error over the last 10 completed orders
    const recent = predictions.slice(-10);
    const sumError = recent.reduce((acc, p) => acc + p.errorMinutes, 0);
    const meanError = sumError / recent.length;
    // Damped learning rate
    this.learnedBiasMinutes = Number((meanError * 0.6).toFixed(2));
    return this.learnedBiasMinutes;
  }

  // Calculate congestion level based on active orders in kitchen
  public calculateCongestionLevel(activeCount: number): CongestionLevel {
    if (activeCount <= 5) return 'NORMAL';
    if (activeCount <= 12) return 'BUSY';
    return 'CONGESTED';
  }

  // Predict wait time for an upcoming or existing order
  public predictWaitTime(
    items: CartItem[],
    activeOrders: Order[],
    currentOrderToken?: string
  ): WaitTimePredictionResult {
    // 1. Calculate base prep time for this specific cart
    const maxItemPrep = items.reduce((max, i) => Math.max(max, i.menuItem.prepTimeMinutes), 3);
    const totalItemQty = items.reduce((sum, i) => sum + i.quantity, 0);
    // Extra items add 0.5 min per additional item
    const baseCartPrep = maxItemPrep + (totalItemQty > 1 ? (totalItemQty - 1) * 0.5 : 0);

    // 2. Count active orders ahead in the queue
    let peopleAhead = 0;
    if (currentOrderToken) {
      const myIdx = activeOrders.findIndex(o => o.tokenNumber === currentOrderToken);
      if (myIdx >= 0) {
        peopleAhead = myIdx; // orders ahead of me in active list
      } else {
        peopleAhead = activeOrders.filter(o => o.status === 'QUEUED' || o.status === 'PREPARING').length;
      }
    } else {
      // For prospective order: all queued or preparing orders are ahead
      peopleAhead = activeOrders.filter(o => o.status === 'QUEUED' || o.status === 'PREPARING').length;
    }

    // 3. Kitchen load factor
    const preparingCount = activeOrders.filter(o => o.status === 'PREPARING').length;
    const queuedCount = activeOrders.filter(o => o.status === 'QUEUED').length;
    const totalActive = preparingCount + queuedCount;

    // Kitchen throughput: 2 parallel chef stations
    const chefCapacity = 2.5; 
    const queueDelay = (peopleAhead * 2.2) / chefCapacity;

    // Multiplier based on current congestion
    let kitchenMultiplier = 1.0;
    if (totalActive > 12) {
      kitchenMultiplier = 1.35;
    } else if (totalActive > 6) {
      kitchenMultiplier = 1.15;
    }

    // Combine formula: Base Prep + Queue Delay * Multiplier + Learned Bias
    let rawEstimate = (baseCartPrep + queueDelay) * kitchenMultiplier + this.learnedBiasMinutes;
    // Clamp to realistic minimum
    const finalMinutes = Math.max(2, Math.round(rawEstimate));

    const congestion = this.calculateCongestionLevel(totalActive);

    // Recommended window calculation for crowd smoothing
    let recommendedWindowText: string | undefined;
    if (congestion === 'CONGESTED' || congestion === 'BUSY') {
      const now = new Date();
      const recStart = new Date(now.getTime() + 35 * 60 * 1000);
      const recEnd = new Date(now.getTime() + 50 * 60 * 1000);
      const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      recommendedWindowText = `${fmtTime(recStart)} – ${fmtTime(recEnd)}`;
    }

    return {
      predictedMinutes: finalMinutes,
      peopleAheadCount: peopleAhead,
      avgItemPrepTime: Number(baseCartPrep.toFixed(1)),
      kitchenLoadMultiplier: kitchenMultiplier,
      confidenceScore: Math.min(96, Math.max(78, 92 - peopleAhead * 2)),
      recommendedWindowText,
      congestionLevel: congestion,
    };
  }

  // Calculate Mean Absolute Error (MAE) from historical predictions
  public calculateMAE(predictions: PredictionPoint[]): number {
    if (!predictions.length) return 0.5;
    const totalAbsError = predictions.reduce((acc, p) => acc + Math.abs(p.errorMinutes), 0);
    return Number((totalAbsError / predictions.length).toFixed(2));
  }
}

export const predictionEngine = new PredictionEngine();
