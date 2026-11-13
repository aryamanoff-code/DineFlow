import React, { useState } from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import { Order } from '../../../types';
import { useLiveOrders } from '../hooks/useLiveOrders';
import { KDSOrderCard } from '../components/KDSOrderCard';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';

export const OrdersPage: React.FC = () => {
  const {
    filteredOrders,
    orders,
    statusFilter,
    setStatusFilter,
    updateStatus,
    loading,
    error,
    refetch,
  } = useLiveOrders();

  const [activeDetailOrder, setActiveDetailOrder] = useState<Order | null>(null);

  const filterTabs = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'New / Pending', count: orders.filter((o) => o.status === 'pending').length },
    { key: 'preparing', label: 'Cooking', count: orders.filter((o) => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: orders.filter((o) => o.status === 'ready').length },
    { key: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  if (loading && orders.length === 0) {
    return (
      <LoadingState
        title="Connecting to Kitchen Display Feed"
        description="Subscribing to real-time order stream..."
        fullHeight
      />
    );
  }

  if (error && orders.length === 0) {
    return (
      <ErrorState
        title="Failed to load orders"
        message={error}
        onRetry={refetch}
        fullHeight
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Stream Status Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-xs">
        {/* Realtime Stream Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Supabase Realtime WebSocket Connected</span>
          </div>

          <button
            onClick={refetch}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 -mb-1 no-scrollbar">
          {filterTabs.map((tab) => {
            const isSelected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`
                  whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-scale shrink-0 flex items-center gap-1.5
                  ${
                    isSelected
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'bg-surface-subtle text-stone-600 hover:bg-stone-200 border border-transparent'
                  }
                `}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isSelected ? 'bg-forest-800 text-amber-200' : 'bg-white text-stone-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title={`No ${statusFilter === 'all' ? '' : statusFilter} orders`}
          description={
            statusFilter === 'all'
              ? 'No active orders in the system. Orders placed by customers will pop in here automatically in real time.'
              : `There are currently no orders in "${statusFilter}" state.`
          }
          action={
            statusFilter !== 'all' && (
              <Button size="sm" variant="secondary" onClick={() => setStatusFilter('all')}>
                Show All Orders
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <KDSOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateStatus}
              onOpenDetail={(o) => setActiveDetailOrder(o)}
            />
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={activeDetailOrder}
        onClose={() => setActiveDetailOrder(null)}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
};
