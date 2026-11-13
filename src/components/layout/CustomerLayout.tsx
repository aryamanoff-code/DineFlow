import React from 'react';
import { Outlet, Link, useSearchParams } from 'react-router-dom';
import { Utensils } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');

  return (
    <div className="min-h-screen bg-stone-100/60 flex justify-center">
      {/* Mobile-first customer container */}
      <div className="w-full max-w-md min-h-screen bg-surface-sand shadow-lg flex flex-col border-x border-surface-border/60">
        {/* Sticky customer header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-border px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-forest-900 text-amber-200 flex items-center justify-center shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-forest-950 block leading-tight">
                DineFlow
              </span>
              <span className="text-[10px] uppercase tracking-wider text-warm-600 font-bold block">
                Digital Ordering
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {table && (
              <div className="bg-forest-50 border border-forest-200 px-2.5 py-1 rounded-full text-xs font-bold text-forest-900">
                Table {table}
              </div>
            )}
            <Link
              to="/admin/login"
              className="text-xs text-stone-500 hover:text-stone-800 font-medium px-2 py-1 rounded-md transition-colors"
            >
              Staff
            </Link>
          </div>
        </header>

        {/* Dynamic customer page content */}
        <main className="flex-1 pb-16">
          <Outlet />
        </main>

        {/* Global minimal customer footer */}
        <footer className="py-4 text-center text-xs text-stone-400 border-t border-surface-border/80 bg-white/50">
          Powered by <span className="font-bold text-forest-900">DineFlow</span> · Contactless Dining
        </footer>
      </div>
    </div>
  );
};
