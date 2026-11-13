import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { MenuItem, MenuCategory } from '../../../types';
import { Button } from '../../../components/ui/Button';

export interface MenuItemModalProps {
  isOpen: boolean;
  item: MenuItem | null; // null means adding a new item
  categories: MenuCategory[];
  restaurantId: string;
  onClose: () => void;
  onSave: (data: Partial<MenuItem> & { name: string; price: number; categoryId: string }) => Promise<boolean>;
  onDelete?: (itemId: string) => Promise<boolean>;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  item,
  categories,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('12.50');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategoryId(item.categoryId || (categories[0]?.id ?? ''));
      setPrice(item.price.toString());
      setDescription(item.description || '');
      setImageUrl(item.imageUrl || '');
      setIsVeg(item.isVeg);
      setIsAvailable(item.isAvailable);
    } else {
      setName('');
      setCategoryId(categories[0]?.id ?? '');
      setPrice('12.00');
      setDescription('');
      setImageUrl('');
      setIsVeg(false);
      setIsAvailable(true);
    }
    setError(null);
  }, [item, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please provide a valid price.');
      return;
    }

    if (!name.trim()) {
      setError('Dish name is required.');
      return;
    }

    if (!categoryId) {
      setError('Please assign a menu category.');
      return;
    }

    setIsSaving(true);
    const success = await onSave({
      id: item?.id,
      name: name.trim(),
      categoryId,
      price: parsedPrice,
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      isVeg,
      isAvailable,
    });

    setIsSaving(false);
    if (success) {
      onClose();
    } else {
      setError('Failed to save menu item. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!item?.id || !onDelete) return;
    if (window.confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
      setIsSaving(true);
      await onDelete(item.id);
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-stone-900">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 text-stone-700 flex items-center justify-center hover:bg-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Dish Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Truffle Burger"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-800"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              {imageUrl && (
                <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Description & Ingredients
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of ingredients, cooking style, or allergen information..."
              rows={3}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 p-3 bg-surface-sand rounded-xl border border-surface-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-stone-800">Vegetarian (VEG)</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-surface-sand rounded-xl border border-surface-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700"
              />
              <span className="text-xs font-bold text-stone-800">In Stock (Available)</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            {item && onDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Item
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
