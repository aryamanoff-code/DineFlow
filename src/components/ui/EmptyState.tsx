import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  fullHeight?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No items found',
  description = 'There is nothing to display here right now.',
  action,
  fullHeight = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullHeight ? 'min-h-[50vh]' : 'py-12'
      } ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-subtle border border-surface-border flex items-center justify-center mb-4 text-stone-400 shadow-sm">
        {icon || <UtensilsCrossed className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
