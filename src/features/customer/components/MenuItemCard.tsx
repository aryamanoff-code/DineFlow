import React from 'react';
import { Plus, Minus, Ban } from 'lucide-react';
import { MenuItem } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

export interface MenuItemCardProps {
  item: MenuItem;
  currency?: string;
  cartQuantity: number;
  onAddToCart: (item: MenuItem) => void;
  onIncreaseQuantity: (itemId: string, currentQty: number) => void;
  onDecreaseQuantity: (itemId: string, currentQty: number) => void;
  onOpenCustomizer?: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  currency = 'USD',
  cartQuantity,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onOpenCustomizer,
}) => {
  const isAvailable = item.isAvailable;

  return (
    <Card
      className={`
        p-3.5 sm:p-4 flex gap-3.5 relative overflow-hidden transition-all duration-200
        ${!isAvailable ? 'bg-stone-50/80 border-dashed border-stone-300 opacity-75' : 'hover:border-forest-200'}
      `}
    >
      {/* Item Image with Badges */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative shadow-inner">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              !isAvailable ? 'grayscale contrast-75' : 'hover:scale-105'
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-bold text-xs">
            No Photo
          </div>
        )}

        {/* Dietary Badge */}
        <div className="absolute top-1.5 left-1.5 shadow-sm">
          <Badge variant={item.isVeg ? 'veg' : 'non-veg'} size="sm" />
        </div>

        {/* Sold Out Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-1 text-center">
            <Ban className="w-4 h-4 mb-0.5 text-rose-300" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-200">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3
              className={`font-bold text-sm sm:text-base leading-snug line-clamp-1 ${
                !isAvailable ? 'text-stone-500 line-through decoration-stone-400' : 'text-stone-900'
              }`}
            >
              {item.name}
            </h3>
          </div>

          {item.description && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
          <span className="font-extrabold text-sm sm:text-base text-forest-950">
            {formatCurrency(item.price, currency)}
          </span>

          {/* Action: Unavailable vs In-Cart Stepper vs Add Button */}
          {!isAvailable ? (
            <span className="text-[11px] font-bold text-stone-400 px-2 py-1 rounded bg-stone-100">
              Unavailable
            </span>
          ) : cartQuantity > 0 ? (
            <div className="inline-flex items-center gap-1.5 bg-forest-50 border border-forest-200 rounded-lg p-0.5">
              <button
                onClick={() => onDecreaseQuantity(item.id, cartQuantity)}
                className="w-7 h-7 rounded-md bg-white text-forest-900 hover:bg-forest-100 flex items-center justify-center shadow-xs touch-scale transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-extrabold text-forest-950">
                {cartQuantity}
              </span>
              <button
                onClick={() => onIncreaseQuantity(item.id, cartQuantity)}
                className="w-7 h-7 rounded-md bg-forest-900 text-white hover:bg-forest-800 flex items-center justify-center shadow-xs touch-scale transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenCustomizer) {
                  onOpenCustomizer(item);
                } else {
                  onAddToCart(item);
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forest-900 text-white hover:bg-forest-800 active:bg-forest-950 text-xs font-bold shadow-xs touch-scale transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
