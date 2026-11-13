import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export interface CartBarProps {
  totalCount: number;
  subtotal: number;
  currency?: string;
  onOpenCart: () => void;
}

export const CartBar: React.FC<CartBarProps> = ({
  totalCount,
  subtotal,
  currency = 'USD',
  onOpenCart,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto z-30 animate-in slide-in-from-bottom-4 duration-200">
      <div
        onClick={onOpenCart}
        className="bg-forest-950 text-white p-3.5 rounded-2xl shadow-float-bottom flex items-center justify-between border border-forest-800 cursor-pointer touch-scale hover:bg-forest-900 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-amber-300 flex items-center justify-center font-bold text-xs relative shadow-inner">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-warm-500 text-white text-[10px] flex items-center justify-center font-extrabold shadow-sm">
              {totalCount}
            </span>
          </div>

          <div>
            <div className="text-xs font-extrabold text-white">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} in tray
            </div>
            <div className="text-sm text-emerald-300 font-extrabold">
              {formatCurrency(subtotal, currency)}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCart();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-warm-500 hover:bg-warm-600 text-white text-xs font-extrabold shadow-sm"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
