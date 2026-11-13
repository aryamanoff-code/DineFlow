import React from 'react';
import { Clock, ChefHat, Bell, Check, XCircle, Utensils, Store } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { getElapsedMinutes } from '../utils/orderMetrics';

export interface KDSOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onOpenDetail?: (order: Order) => void;
}

export const KDSOrderCard: React.FC<KDSOrderCardProps> = ({
  order,
  onUpdateStatus,
  onOpenDetail,
}) => {
  const elapsed = getElapsedMinutes(order.createdAt);

  const getBorderColor = () => {
    switch (order.status) {
      case 'pending':
        return 'border-amber-300 bg-amber-50/20';
      case 'preparing':
        return 'border-sky-300 bg-sky-50/20';
      case 'ready':
        return 'border-emerald-300 bg-emerald-50/20';
      case 'completed':
        return 'border-stone-200 bg-stone-50/50 opacity-80';
      case 'cancelled':
        return 'border-rose-200 bg-rose-50/30 opacity-70';
      default:
        return 'border-stone-200';
    }
  };

  return (
    <Card
      className={`p-4 sm:p-5 flex flex-col justify-between border-2 transition-all shadow-sm ${getBorderColor()}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-3">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onOpenDetail?.(order)}
              className="font-mono text-base font-extrabold text-stone-900 cursor-pointer hover:underline"
            >
              {order.orderNumber}
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 font-bold text-xs text-stone-800">
              {order.orderType === 'dine_in' ? (
                <>
                  <Utensils className="w-3 h-3 text-forest-800" />
                  <span>Table {order.tableNumber || '?'}</span>
                </>
              ) : (
                <>
                  <Store className="w-3 h-3 text-warm-700" />
                  <span>Takeaway</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
              <Clock className="w-3 h-3" />
              {elapsed}m ago
            </span>
            <Badge status={order.status} size="sm" />
          </div>
        </div>

        {/* Customer & Notes */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
          <div>
            Diner: <span className="font-bold text-stone-800">{order.customerName}</span>
          </div>
          {order.customerPhone && (
            <span className="font-mono text-[11px] text-stone-400">{order.customerPhone}</span>
          )}
        </div>

        {order.notes && (
          <div className="p-2 mb-3 bg-amber-50/90 border border-amber-200/80 rounded-lg text-xs text-amber-900 font-medium italic">
            "{order.notes}"
          </div>
        )}

        {/* Line Items */}
        <div className="space-y-1.5 mb-4">
          {order.items.map((it, idx) => (
            <div
              key={idx}
              className="p-2 bg-white rounded-xl border border-stone-200/70 text-xs flex items-start justify-between"
            >
              <div className="pr-2">
                <span className="font-bold text-stone-900">{it.name}</span>
                {it.instructions && (
                  <div className="text-[10px] text-warm-700 font-semibold italic mt-0.5">
                    Note: "{it.instructions}"
                  </div>
                )}
              </div>
              <span className="px-2 py-0.5 rounded bg-stone-100 font-mono font-bold text-stone-800 text-xs shrink-0">
                x{it.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
        <div className="font-extrabold text-sm text-stone-900">
          ${order.totalAmount.toFixed(2)}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Status Transitions */}
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Cancel Order"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<ChefHat className="w-3.5 h-3.5" />}
                onClick={() => onUpdateStatus(order.id, 'preparing')}
              >
                Cook
              </Button>
            </>
          )}

          {order.status === 'preparing' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Cancel Order"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <Button
                size="sm"
                variant="accent"
                leftIcon={<Bell className="w-3.5 h-3.5" />}
                onClick={() => onUpdateStatus(order.id, 'ready')}
              >
                Ready
              </Button>
            </>
          )}

          {order.status === 'ready' && (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
              onClick={() => onUpdateStatus(order.id, 'completed')}
            >
              Complete
            </Button>
          )}

          {order.status === 'completed' && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              Fulfilled
            </span>
          )}

          {order.status === 'cancelled' && (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md">
              Cancelled
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
