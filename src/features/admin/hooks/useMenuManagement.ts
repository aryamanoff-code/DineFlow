import { useState, useEffect, useCallback, useMemo } from 'react';
import { MenuCategory, MenuItem } from '../../../types';
import { adminService } from '../utils/adminService';

export interface UseMenuManagementReturn {
  categories: MenuCategory[];
  items: MenuItem[];
  filteredItems: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  setSelectedCategory: (catId: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleAvailability: (itemId: string, isAvailable: boolean) => Promise<boolean>;
  saveItem: (item: Partial<MenuItem> & { name: string; price: number; categoryId: string }) => Promise<boolean>;
  deleteItem: (itemId: string) => Promise<boolean>;
  refetch: () => void;
}

export const useMenuManagement = (restaurantId: string = adminService.getRestaurantId()): UseMenuManagementReturn => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await adminService.fetchMenu(restaurantId);
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setCategories(res.data.categories);
      setItems(res.data.items);
    }
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const toggleAvailability = useCallback(
    async (itemId: string, isAvailable: boolean): Promise<boolean> => {
      // Optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isAvailable } : i))
      );

      const res = await adminService.updateItemAvailability(itemId, isAvailable);
      if (res.error) {
        loadMenu();
        return false;
      }
      return true;
    },
    [loadMenu]
  );

  const saveItem = useCallback(
    async (itemData: Partial<MenuItem> & { name: string; price: number; categoryId: string }): Promise<boolean> => {
      const res = await adminService.saveMenuItem({
        ...itemData,
        restaurantId,
      });

      if (res.error) {
        return false;
      }

      await loadMenu();
      return true;
    },
    [restaurantId, loadMenu]
  );

  const deleteItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      const res = await adminService.deleteMenuItem(itemId);
      if (res.error) {
        loadMenu();
        return false;
      }
      return true;
    },
    [loadMenu]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory && item.categoryId !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return {
    categories,
    items,
    filteredItems,
    loading,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    toggleAvailability,
    saveItem,
    deleteItem,
    refetch: loadMenu,
  };
};
