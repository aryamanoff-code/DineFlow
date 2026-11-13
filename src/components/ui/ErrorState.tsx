import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  fullHeight?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while processing your request. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  fullHeight = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullHeight ? 'min-h-[50vh]' : 'py-10'
      } ${className}`}
      role="alert"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-600 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-600 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
