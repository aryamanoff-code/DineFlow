import { OrderCartItem } from '../../../types';

/**
 * Calculates line subtotal for an item given its unit price and quantity.
 */
export const calculateItemSubtotal = (price: number, quantity: number): number => {
  return Math.round(price * quantity * 100) / 100;
};

/**
 * Computes the grand subtotal for an array of cart items.
 */
export const calculateCartSubtotal = (items: OrderCartItem[]): number => {
  const sum = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return Math.round(sum * 100) / 100;
};

/**
 * Computes total item count in cart.
 */
export const calculateCartCount = (items: OrderCartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};
