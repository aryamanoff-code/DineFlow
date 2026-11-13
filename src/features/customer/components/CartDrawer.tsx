import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { OrderCartItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatCurrency } from '../utils/formatters';

export interface CartDrawerProps {
  isOpen: boolean;
  items: OrderCartItem[];
  subtotal: number;
  currency?: string;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  subtotal,
  currency = 'USD',
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-sand shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-900">Your Cart</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-forest-900 text-white">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200/70 text-stone-700 flex items-center justify-center hover:bg-stone-300 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-warm-600" />}
              title="Your cart is empty"
              description="Explore the menu and add delicious food items to start your order."
              action={
                <Button size="sm" variant="primary" onClick={onClose}>
                  Browse Menu
                </Button>
              }
            />
          ) : (
            items.map((item) => (
              <div
                key={item.itemId}
                className="p-3 bg-surface-sand rounded-xl border border-surface-border flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.itemId)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-stone-500 mt-0.5">
                    {formatCurrency(item.price, currency)} each
                  </div>
                  {item.instructions && (
                    <div className="text-[11px] font-medium text-warm-800 bg-warm-100/70 px-2 py-0.5 rounded mt-1.5 inline-block">
                      Note: {item.instructions}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-forest-950">
                    {formatCurrency(item.price * item.quantity, currency)}
                  </span>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-stone-50 hover:bg-stone-200 text-stone-700 flex items-center justify-center touch-scale"
                      aria-label="Decrease quantity"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                    </button>
                    <span className="w-4 text-center text-xs font-extrabold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-forest-900 hover:bg-forest-800 text-white flex items-center justify-center touch-scale"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 border-t border-surface-border bg-white space-y-3 shrink-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600 font-medium">Subtotal</span>
              <span className="font-extrabold text-base text-stone-900">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            <Button
              variant="accent"
              fullWidth
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onProceedToCheckout}
            >
              Proceed to Checkout · {formatCurrency(subtotal, currency)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
