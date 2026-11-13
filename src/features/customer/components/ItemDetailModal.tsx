import React, { useState } from 'react';
import { X, Plus, Minus, MessageSquare } from 'lucide-react';
import { MenuItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

export interface ItemDetailModalProps {
  item: MenuItem | null;
  currency?: string;
  onClose: () => void;
  onConfirmAdd: (item: MenuItem, quantity: number, instructions?: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  currency = 'USD',
  onClose,
  onConfirmAdd,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');

  if (!item) return null;

  const handleAdd = () => {
    onConfirmAdd(item, quantity, instructions.trim() || undefined);
    onClose();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        {/* Header Image */}
        {item.imageUrl && (
          <div className="relative h-44 w-full bg-stone-100 shrink-0">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <Badge variant={item.isVeg ? 'veg' : 'non-veg'} />
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/60 text-white flex items-center justify-center hover:bg-stone-900 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {!item.imageUrl && (
            <div className="flex justify-between items-start">
              <Badge variant={item.isVeg ? 'veg' : 'non-veg'} />
              <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div>
            <h2 className="text-lg font-extrabold text-stone-900">{item.name}</h2>
            <div className="text-base font-extrabold text-forest-900 mt-0.5">
              {formatCurrency(item.price, currency)}
            </div>
            {item.description && (
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Special Requests / Notes Input */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-warm-600" />
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra crispy, dressing on side, no onions"
              rows={2}
              maxLength={150}
              className="w-full p-3 bg-stone-50 border border-surface-border rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-800 resize-none"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between p-3 bg-surface-sand rounded-xl border border-surface-border">
            <span className="text-xs font-bold text-stone-700">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-800 disabled:opacity-40 flex items-center justify-center font-bold touch-scale"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-extrabold text-forest-950">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center font-bold touch-scale"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Add Action */}
        <div className="p-4 border-t border-surface-border bg-white shrink-0">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleAdd}
            disabled={!item.isAvailable}
          >
            {item.isAvailable
              ? `Add to Cart · ${formatCurrency(totalPrice, currency)}`
              : 'Item Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};
