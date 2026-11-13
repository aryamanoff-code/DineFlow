import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-sand flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-forest-900 text-amber-300 flex items-center justify-center mb-4 shadow-md">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-stone-600 max-w-sm mb-6">
        The table or menu view you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
