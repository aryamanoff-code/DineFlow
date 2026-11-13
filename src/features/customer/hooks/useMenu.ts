import { useState, useEffect, useMemo, useCallback } from 'react';
import { Restaurant, MenuCategory, MenuItem } from '../../../types';
import { customerService } from '../utils/customerService';

export interface UseMenuReturn {
  restaurant: Restaurant | null;
  categories: MenuCategory[];
  items: MenuItem[];
  filteredItems: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  isVegOnly: boolean;
  setSelectedCategoryId: (catId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsVegOnly: (vegOnly: boolean) => void;
  refetch: () => void;
}

export const useMenu = (slug: string = 'the-bistro'): UseMenuReturn => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await customerService.fetchMenuBySlug(slug);
    if (res.error || !res.data) {
      setError(res.error || 'Failed to load restaurant menu');
    } else {
      setRestaurant(res.data.restaurant);
      setCategories(res.data.categories);
      setItems(res.data.items);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Derived filtered items based on category, search, and vegetarian filter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }
      // Vegetarian toggle
      if (isVegOnly && !item.isVeg) {
        return false;
      }
      // Search term matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [items, selectedCategoryId, isVegOnly, searchQuery]);

  return {
    restaurant,
    categories,
    items,
    filteredItems,
    loading,
    error,
    selectedCategoryId,
    searchQuery,
    isVegOnly,
    setSelectedCategoryId,
    setSearchQuery,
    setIsVegOnly,
    refetch: loadMenu,
  };
};
