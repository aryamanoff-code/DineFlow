import { useState, useEffect, useCallback } from 'react';
import { MenuItem, OrderCartItem } from '../../../types';
import { calculateCartCount, calculateCartSubtotal } from '../utils/priceCalculators';

const CART_STORAGE_KEY = 'dineflow_customer_cart';

export interface UseCartReturn {
  items: OrderCartItem[];
  totalCount: number;
  subtotal: number;
  isEmpty: boolean;
  addItem: (item: MenuItem, quantity?: number, instructions?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<OrderCartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage on cart change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart to localStorage', e);
    }
  }, [items]);

  const totalCount = calculateCartCount(items);
  const subtotal = calculateCartSubtotal(items);
  const isEmpty = items.length === 0;

  const getItemQuantity = useCallback(
    (itemId: string): number => {
      const match = items.find((i) => i.itemId === itemId);
      return match ? match.quantity : 0;
    },
    [items]
  );

  const addItem = useCallback((item: MenuItem, quantity: number = 1, instructions?: string) => {
    if (!item.isAvailable || quantity <= 0) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemId === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
          instructions: instructions !== undefined ? instructions : existing.instructions,
        };
        return updated;
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
          instructions: instructions || undefined,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.itemId !== itemId);
      }
      return prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  }, []);

  return {
    items,
    totalCount,
    subtotal,
    isEmpty,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
  };
};
