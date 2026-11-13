import React from 'react';
import { X, Clock, ChefHat, Bell, Check, XCircle, Utensils, Store } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-stone-900">{order.orderNumber}</h2>
            <Badge status={order.status} />
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 text-stone-700 flex items-center justify-center hover:bg-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-sand rounded-2xl border border-surface-border text-xs">
            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider block mb-0.5">
                Fulfillment
              </span>
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                {order.orderType === 'dine_in' ? (
                  <>
                    <Utensils className="w-3.5 h-3.5 text-forest-800" />
                    <span>Dine-In (Table {order.tableNumber || 'N/A'})</span>
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-warm-700" />
                    <span>Takeaway / Pickup</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider block mb-0.5">
                Customer Name
              </span>
              <div className="font-bold text-stone-900">{order.customerName}</div>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider block mb-0.5">
                Contact Phone
              </span>
              <div className="font-medium text-stone-700">{order.customerPhone || 'Not provided'}</div>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider block mb-0.5">
                Received At
              </span>
              <div className="font-medium text-stone-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              <span className="font-bold block mb-0.5">Kitchen Note:</span>
              "{order.notes}"
            </div>
          )}

          {/* Itemized Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Order Items ({order.items.length})
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
              {order.items.map((it, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between bg-white">
                  <div className="pr-3">
                    <div className="font-bold text-stone-900">
                      {it.quantity}x {it.name}
                    </div>
                    {it.instructions && (
                      <div className="text-[11px] text-warm-700 italic mt-0.5">
                        Instructions: {it.instructions}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-stone-900 shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-bold">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.taxAmount ? (
              <div className="flex justify-between text-stone-600">
                <span>Tax</span>
                <span className="font-bold">${order.taxAmount.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-stone-900 text-sm">
              <span>Total Bill</span>
              <span className="text-forest-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => {
                  onUpdateStatus(order.id, 'cancelled');
                  onClose();
                }}
              >
                Cancel Order
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {order.status === 'pending' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ChefHat className="w-4 h-4" />}
                onClick={() => {
                  onUpdateStatus(order.id, 'preparing');
                  onClose();
                }}
              >
                Start Preparing
              </Button>
            )}

            {order.status === 'preparing' && (
              <Button
                variant="accent"
                size="sm"
                leftIcon={<Bell className="w-4 h-4" />}
                onClick={() => {
                  onUpdateStatus(order.id, 'ready');
                  onClose();
                }}
              >
                Mark as Ready
              </Button>
            )}

            {order.status === 'ready' && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Check className="w-4 h-4 text-emerald-600" />}
                onClick={() => {
                  onUpdateStatus(order.id, 'completed');
                  onClose();
                }}
              >
                Complete Fulfillment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
