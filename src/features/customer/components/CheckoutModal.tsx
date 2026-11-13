import React, { useState } from 'react';
import { X, Utensils, Store, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import { OrderType, OrderCartItem, CreateOrderDTO } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export interface CheckoutModalProps {
  isOpen: boolean;
  restaurantId: string;
  items: OrderCartItem[];
  subtotal: number;
  currency?: string;
  initialTableNumber?: string | null;
  isSubmitting: boolean;
  orderError: string | null;
  onClose: () => void;
  onSubmitOrder: (payload: CreateOrderDTO) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  restaurantId,
  items,
  subtotal,
  currency = 'USD',
  initialTableNumber,
  isSubmitting,
  orderError,
  onClose,
  onSubmitOrder,
}) => {
  const [orderType, setOrderType] = useState<OrderType>(
    initialTableNumber ? 'dine_in' : 'dine_in'
  );
  const [tableNumber, setTableNumber] = useState<string>(initialTableNumber || '4');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim()) {
      setValidationError('Please enter your name for order identification.');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setValidationError('Please specify your table number for dine-in delivery.');
      return;
    }

    if (items.length === 0) {
      setValidationError('Your cart is empty.');
      return;
    }

    const payload: CreateOrderDTO = {
      restaurantId,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber.trim() : null,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      items,
      totalAmount: subtotal,
    };

    onSubmitOrder(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-sand shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">Finalize Order</h2>
            <p className="text-[11px] text-stone-500">Contactless dining & instant ticket dispatch</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 text-stone-700 flex items-center justify-center hover:bg-stone-300"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Order Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Dining Option
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`
                  p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all touch-scale
                  ${
                    orderType === 'dine_in'
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-surface-border hover:bg-stone-100'
                  }
                `}
              >
                <Utensils className="w-4 h-4" />
                <span className="text-xs font-bold">Dine-In</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`
                  p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all touch-scale
                  ${
                    orderType === 'takeaway'
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-surface-border hover:bg-stone-100'
                  }
                `}
              >
                <Store className="w-4 h-4" />
                <span className="text-xs font-bold">Takeaway / Pickup</span>
              </button>
            </div>
          </div>

          {/* Table Number (If Dine-In) */}
          {orderType === 'dine_in' && (
            <div className="bg-forest-50/70 p-3.5 rounded-xl border border-forest-100">
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                Table Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 4 or Patio-1"
                  className="w-full px-3.5 py-2 bg-white border border-forest-200 rounded-lg text-sm font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  required
                />
                <div className="flex gap-1 shrink-0">
                  {['1', '2', '4', '8'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTableNumber(t)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
                        tableNumber === t
                          ? 'bg-forest-900 text-white border-forest-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      T{t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-forest-800 mt-1 font-medium">
                Auto-detected from QR code. Adjust if you switched tables.
              </p>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alex Miller"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-surface-border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-stone-400 font-normal">(Optional for SMS alerts)</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-surface-border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Order Notes <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Birthday celebration, seating near patio"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-surface-border rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          {/* Pay at Counter Notice */}
          <div className="p-3 bg-warm-50 rounded-xl border border-warm-200/80 flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-warm-700 shrink-0 mt-0.5" />
            <div className="text-xs text-warm-900 leading-relaxed">
              <span className="font-bold">Pay-at-Counter / Pay-at-Table:</span> No online card required right now! Your order goes directly to the kitchen, and you can settle the bill with cash or card upon service.
            </div>
          </div>

          {/* Error Message */}
          {(validationError || orderError) && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError || orderError}</span>
            </div>
          )}

          {/* Order Summary Recap */}
          <div className="p-3 bg-stone-50 rounded-xl border border-surface-border text-xs space-y-1.5">
            <div className="font-bold text-stone-800 uppercase tracking-wider pb-1 border-b border-stone-200">
              Order Breakdown ({items.length} items)
            </div>
            {items.map((it) => (
              <div key={it.itemId} className="flex justify-between text-stone-600">
                <span className="truncate pr-2">
                  {it.quantity}x {it.name}
                </span>
                <span className="font-bold text-stone-900 shrink-0">
                  {formatCurrency(it.price * it.quantity, currency)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-stone-900 text-sm">
              <span>Total Payable</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Place Order · {formatCurrency(subtotal, currency)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
