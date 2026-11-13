import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  fullHeight?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading...',
  description = 'Fetching the freshest data from DineFlow',
  fullHeight = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullHeight ? 'min-h-[60vh]' : 'py-12'
      } ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center mb-4 shadow-sm">
        <LoadingSpinner size="md" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm">{description}</p>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-stone-200/80 rounded-lg ${className}`} />;
};
