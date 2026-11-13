import { useState, useCallback } from 'react';
import { Order, CreateOrderDTO } from '../../../types';
import { customerService } from '../utils/customerService';

export interface UseCustomerOrderReturn {
  isSubmitting: boolean;
  orderError: string | null;
  confirmedOrder: Order | null;
  submitOrder: (payload: CreateOrderDTO) => Promise<Order | null>;
  resetOrder: () => void;
}

export const useCustomerOrder = (): UseCustomerOrderReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const submitOrder = useCallback(async (payload: CreateOrderDTO): Promise<Order | null> => {
    setIsSubmitting(true);
    setOrderError(null);

    const res = await customerService.createOrder(payload);

    if (res.error || !res.data) {
      setOrderError(res.error || 'Failed to place order');
      setIsSubmitting(false);
      return null;
    }

    setConfirmedOrder(res.data);
    setIsSubmitting(false);
    return res.data;
  }, []);

  const resetOrder = useCallback(() => {
    setConfirmedOrder(null);
    setOrderError(null);
    setIsSubmitting(false);
  }, []);

  return {
    isSubmitting,
    orderError,
    confirmedOrder,
    submitOrder,
    resetOrder,
  };
};
