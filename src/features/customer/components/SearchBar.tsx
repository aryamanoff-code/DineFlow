import React from 'react';
import { Search, X, Leaf } from 'lucide-react';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isVegOnly: boolean;
  onToggleVegOnly: (vegOnly: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isVegOnly,
  onToggleVegOnly,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search dishes, drinks, desserts..."
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-surface-border rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-transparent transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Vegetarian Filter Pill Button */}
      <button
        onClick={() => onToggleVegOnly(!isVegOnly)}
        className={`
          flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 touch-scale
          ${
            isVegOnly
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-emerald-800 border-surface-border hover:bg-emerald-50'
          }
        `}
        title="Toggle Vegetarian Only"
      >
        <Leaf className="w-3.5 h-3.5" />
        <span>Veg</span>
      </button>
    </div>
  );
};
