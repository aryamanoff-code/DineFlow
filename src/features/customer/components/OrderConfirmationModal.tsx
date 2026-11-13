import React from 'react';
import { CheckCircle2, Utensils, Store, RotateCcw } from 'lucide-react';
import { Order } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatOrderType, formatTime } from '../utils/formatters';

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  currency?: string;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  order,
  currency = 'USD',
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-emerald-100">
        {/* Celebration Header */}
        <div className="bg-forest-900 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-forest-800 text-emerald-300 border border-forest-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>

          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">
            Order Received by Kitchen
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Ticket {order.orderNumber}
          </h2>

          <p className="text-xs text-forest-200 mt-1 max-w-xs mx-auto">
            Your order has been transmitted directly to the kitchen display board.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Status & Dining Mode Badges */}
          <div className="flex items-center justify-between p-3 bg-surface-sand rounded-xl border border-surface-border">
            <div className="flex items-center gap-2">
              {order.orderType === 'dine_in' ? (
                <Utensils className="w-4 h-4 text-forest-900" />
              ) : (
                <Store className="w-4 h-4 text-warm-600" />
              )}
              <span className="text-xs font-bold text-stone-900">
                {formatOrderType(order.orderType, order.tableNumber)}
              </span>
            </div>

            <Badge status={order.status} size="sm">
              Received
            </Badge>
          </div>

          {/* Customer Meta */}
          <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
            <div className="flex justify-between">
              <span className="text-stone-400 font-semibold">Diner:</span>
              <span className="font-bold text-stone-800">{order.customerName}</span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between">
                <span className="text-stone-400 font-semibold">Table:</span>
                <span className="font-bold text-stone-800">Table {order.tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-400 font-semibold">Time:</span>
              <span className="font-bold text-stone-800">{formatTime(order.createdAt)}</span>
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Itemized Receipt
            </h4>
            <div className="divide-y divide-surface-border border-y border-surface-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start justify-between text-xs">
                  <div className="pr-3">
                    <span className="font-bold text-stone-900">
                      {item.quantity}x {item.name}
                    </span>
                    {item.instructions && (
                      <div className="text-[11px] text-warm-700 italic">
                        "{item.instructions}"
                      </div>
                    )}
                  </div>
                  <span className="font-extrabold text-stone-900 shrink-0">
                    {formatCurrency(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Payment Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
            <div className="flex justify-between items-center text-sm font-extrabold text-emerald-950">
              <span>Total Bill</span>
              <span>{formatCurrency(order.totalAmount, currency)}</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-emerald-200/70">
              Please pay at the counter or table when your food is served.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-surface-border bg-white shrink-0">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onClose}
          >
            Done · Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
