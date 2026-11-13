import React from 'react';
import { MenuCategory } from '../../../types';

export interface CategoryPillsProps {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  totalItemsCount?: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
      {/* "All Items" Pill */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`
          whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 touch-scale shrink-0
          ${
            selectedCategoryId === null
              ? 'bg-forest-900 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-surface-border hover:bg-stone-50'
          }
        `}
      >
        All Items
      </button>

      {/* Dynamic Categories */}
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 touch-scale shrink-0
              ${
                isSelected
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-surface-border hover:bg-stone-50'
              }
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};
