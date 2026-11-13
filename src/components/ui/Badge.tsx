import React from 'react';
import { OrderStatus } from '../../types';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'veg'
  | 'non-veg';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  status?: OrderStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusVariantMap: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
  preparing: {
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-800',
    dot: 'bg-sky-500',
    label: 'Preparing',
  },
  ready: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Ready',
  },
  completed: {
    bg: 'bg-stone-100 border-stone-200',
    text: 'text-stone-700',
    dot: 'bg-stone-400',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    label: 'Cancelled',
  },
};

const customVariantStyles: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700 border-stone-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  veg: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
  'non-veg': 'bg-rose-50 text-rose-900 border-rose-300 font-bold',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (status) {
    const config = statusVariantMap[status];
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${config.text} ${sizeClasses} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span>{children || config.label}</span>
      </span>
    );
  }

  if (variant === 'veg' || variant === 'non-veg') {
    const isVeg = variant === 'veg';
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border ${customVariantStyles[variant]} ${sizeClasses} ${className}`}
        title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      >
        <span
          className={`w-2 h-2 rounded-full border ${
            isVeg ? 'border-emerald-600 bg-emerald-600' : 'border-rose-600 bg-rose-600'
          }`}
        />
        <span>{children || (isVeg ? 'VEG' : 'NON-VEG')}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${customVariantStyles[variant]} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
