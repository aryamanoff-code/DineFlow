import React, { useState } from 'react';
import { Plus, Search, Edit2, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { MenuItem } from '../../../types';
import { useMenuManagement } from '../hooks/useMenuManagement';
import { MenuItemModal } from '../components/MenuItemModal';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export const MenuManagementPage: React.FC = () => {
  const {
    categories,
    items,
    filteredItems,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    toggleAvailability,
    saveItem,
    deleteItem,
    loading,
    error,
    refetch,
  } = useMenuManagement();

  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unavailableCount = items.filter((i) => !i.isAvailable).length;

  if (loading && items.length === 0) {
    return (
      <LoadingState
        title="Loading Menu Management"
        description="Fetching dishes, categories and pricing data..."
        fullHeight
      />
    );
  }

  if (error && items.length === 0) {
    return (
      <ErrorState
        title="Failed to load menu"
        message={error}
        onRetry={refetch}
        fullHeight
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Action and Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name or ingredient..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest-800"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setActiveModalItem(null);
              setIsModalOpen(true);
            }}
          >
            Add Menu Item
          </Button>

          <button
            onClick={refetch}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            title="Refresh menu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 86'd Alert Banner */}
      {unavailableCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">{unavailableCount} items are currently 86'd (Sold Out):</span>{' '}
              These dishes are automatically dimmed on public diner menus and blocked from checkout.
            </div>
          </div>
        </div>
      )}

      {/* Menu Table Card */}
      <Card className="p-0 overflow-hidden">
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No dishes found"
            description="No menu items match your search or category filter."
            action={
              (searchQuery || selectedCategory) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-surface-border text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Dish</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Dietary</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5 text-center">Availability</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredItems.map((item) => {
                  const categoryName = categories.find((c) => c.id === item.categoryId)?.name || 'General';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        !item.isAvailable ? 'bg-stone-50/70 opacity-80' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                                No pic
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              <span>{item.name}</span>
                              {!item.isAvailable && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                                  86'd
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-[11px] text-stone-500 line-clamp-1 max-w-sm mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-stone-600">
                        {categoryName}
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge variant={item.isVeg ? 'veg' : 'non-veg'} size="sm" />
                      </td>

                      <td className="px-5 py-3.5 font-extrabold text-sm text-stone-900">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggleAvailability(item.id, !item.isAvailable)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all touch-scale
                            ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }
                          `}
                          title="Click to toggle stock status"
                        >
                          {item.isAvailable ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> In Stock
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" /> 86'd (Sold Out)
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Edit2 className="w-3 h-3" />}
                          onClick={() => {
                            setActiveModalItem(item);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Dish Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        item={activeModalItem}
        categories={categories}
        restaurantId={categories[0]?.restaurantId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'}
        onClose={() => setIsModalOpen(false)}
        onSave={saveItem}
        onDelete={deleteItem}
      />
    </div>
  );
};
