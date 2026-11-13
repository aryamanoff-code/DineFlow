import { useState, useEffect, useCallback, useMemo } from 'react';
import { Order, OrderStatus } from '../../../types';
import { adminService } from '../utils/adminService';
import { calculateOrderMetrics, DashboardMetrics } from '../utils/orderMetrics';

export interface UseLiveOrdersReturn {
  orders: Order[];
  filteredOrders: Order[];
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  refetch: () => void;
}

export const useLiveOrders = (restaurantId: string = adminService.getRestaurantId()): UseLiveOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await adminService.fetchLiveOrders(restaurantId);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setOrders(res.data);
    }
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();

    // Subscribe to live orders using Supabase Realtime
    const unsubscribe = adminService.subscribeToLiveOrders(
      restaurantId,
      (newOrder) => {
        setOrders((prev) => {
          // Avoid duplicate inserts
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      },
      (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [restaurantId, fetchOrders]);

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<boolean> => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
      );

      const res = await adminService.updateOrderStatus(orderId, status);
      if (res.error) {
        // Rollback on error
        fetchOrders();
        return false;
      }
      return true;
    },
    [fetchOrders]
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const metrics = useMemo(() => calculateOrderMetrics(orders), [orders]);

  return {
    orders,
    filteredOrders,
    metrics,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    updateStatus,
    refetch: fetchOrders,
  };
};
