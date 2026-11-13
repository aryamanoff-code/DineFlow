import React from 'react';
import { MapPin, Phone, Clock, Store } from 'lucide-react';
import { Restaurant } from '../../../types';

export interface RestaurantHeaderProps {
  restaurant: Restaurant;
  tableNumber?: string | null;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  restaurant,
  tableNumber,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-surface-border shadow-card-subtle relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {restaurant.name}
            </h1>
          </div>

          {restaurant.description && (
            <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 pt-1 text-xs text-stone-500 font-medium">
            {restaurant.address && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate max-w-[200px]">{restaurant.address}</span>
              </span>
            )}

            {restaurant.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{restaurant.phone}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Open for Dine-In & Pickup</span>
            </span>
          </div>
        </div>

        {/* Table / Dining Mode Pill */}
        <div className="shrink-0">
          {tableNumber ? (
            <div className="bg-forest-900 text-amber-200 px-3 py-1.5 rounded-xl font-bold text-xs text-center shadow-sm border border-forest-800">
              <span className="block text-[9px] uppercase tracking-wider text-forest-200 font-semibold">
                Seated At
              </span>
              Table {tableNumber}
            </div>
          ) : (
            <div className="bg-warm-50 text-warm-800 px-3 py-1.5 rounded-xl font-bold text-xs text-center border border-warm-200">
              <Store className="w-3.5 h-3.5 mx-auto mb-0.5 text-warm-600" />
              Takeaway
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
