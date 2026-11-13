import { OrderType } from '../../../types';

/**
 * Formats a numeric price into a currency string.
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Returns a human-friendly label for order fulfillment mode.
 */
export const formatOrderType = (type: OrderType, tableNumber?: string | null): string => {
  if (type === 'dine_in') {
    return tableNumber ? `Dine-In (Table ${tableNumber})` : 'Dine-In';
  }
  return 'Takeaway / Pickup';
};

/**
 * Formats an ISO date-time string into a localized time string.
 */
export const formatTime = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
