import { Order } from '../../../types';

export interface DashboardMetrics {
  totalOrdersToday: number;
  newOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSalesToday: number;
}

/**
 * Dynamically computes operational KPI metrics from active orders array.
 */
export const calculateOrderMetrics = (orders: Order[]): DashboardMetrics => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let totalOrdersToday = 0;
  let newOrders = 0;
  let preparingOrders = 0;
  let readyOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;
  let totalSalesToday = 0;

  for (const order of orders) {
    const orderTime = new Date(order.createdAt).getTime();
    const isToday = orderTime >= startOfDay;

    if (isToday) {
      totalOrdersToday += 1;
      if (order.status !== 'cancelled') {
        totalSalesToday += order.totalAmount;
      }
    }

    switch (order.status) {
      case 'pending':
        newOrders += 1;
        break;
      case 'preparing':
        preparingOrders += 1;
        break;
      case 'ready':
        readyOrders += 1;
        break;
      case 'completed':
        completedOrders += 1;
        break;
      case 'cancelled':
        cancelledOrders += 1;
        break;
    }
  }

  return {
    totalOrdersToday,
    newOrders,
    preparingOrders,
    readyOrders,
    completedOrders,
    cancelledOrders,
    totalSalesToday: Math.round(totalSalesToday * 100) / 100,
  };
};

/**
 * Calculates minutes elapsed since an order timestamp.
 */
export const getElapsedMinutes = (createdAt: string): number => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};
