import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-forest-800 ${className}`} role="status">
      <Loader2 className={`${sizeMap[size]} animate-spin text-forest-800`} />
      {label && <span className="text-sm font-medium text-stone-600">{label}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
