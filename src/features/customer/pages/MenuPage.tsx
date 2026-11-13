import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Plus, ShoppingBag } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';

const sampleCategories = ['All Items', 'Starters', 'Main Course', 'Beverages', 'Desserts'];

export const MenuPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const table = searchParams.get('table');

  const [activeCategory, setActiveCategory] = useState('All Items');
  const [simulatedState, setSimulatedState] = useState<'content' | 'loading' | 'error'>('content');

  // Preview mock items for layout showcase (actual items will load from menuService in feature phase)
  const previewItems = [
    {
      id: 'item-1',
      name: 'Classic Truffle Burger',
      category: 'Main Course',
      description: 'Handcrafted Angus beef patty, shaved black truffles, aged cheddar, arugula on brioche.',
      price: 16.50,
      isVeg: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'item-2',
      name: 'Wild Mushroom Risotto',
      category: 'Main Course',
      description: 'Slow-simmered Arborio rice, forest mushrooms, thyme, Parmigiano-Reggiano crisps.',
      price: 14.00,
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'item-3',
      name: 'Crispy Rosemary Bruschetta',
      category: 'Starters',
      description: 'Charred artisan baguette, heirloom tomatoes, fresh basil, garlic oil, aged balsamic.',
      price: 9.50,
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=500&q=80',
    },
  ];

  if (simulatedState === 'loading') {
    return (
      <div className="p-4">
        <div className="mb-4 text-center">
          <Button size="sm" variant="secondary" onClick={() => setSimulatedState('content')}>
            Back to Menu
          </Button>
        </div>
        <LoadingState
          title="Loading The Bistro Menu"
          description="Fetching freshly updated prices and availability..."
          fullHeight
        />
      </div>
    );
  }

  if (simulatedState === 'error') {
    return (
      <div className="p-4">
        <div className="mb-4 text-center">
          <Button size="sm" variant="secondary" onClick={() => setSimulatedState('content')}>
            Back to Menu
          </Button>
        </div>
        <ErrorState
          title="Unable to load menu"
          message="Could not connect to restaurant services. Please check your table connection."
          onRetry={() => setSimulatedState('content')}
          fullHeight
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      {/* State Switcher for Reviewers */}
      <div className="bg-stone-200/60 p-2 rounded-xl flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-600">UI State Preview:</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSimulatedState('content')}
            className={`px-2 py-1 rounded font-semibold ${
              simulatedState === 'content' ? 'bg-forest-900 text-white' : 'bg-white text-stone-700'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setSimulatedState('loading')}
            className="px-2 py-1 rounded font-semibold bg-white text-stone-700 hover:bg-stone-50"
          >
            Loading
          </button>
          <button
            onClick={() => setSimulatedState('error')}
            className="px-2 py-1 rounded font-semibold bg-white text-stone-700 hover:bg-stone-50"
          >
            Error
          </button>
        </div>
      </div>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-surface-border shadow-card-subtle">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-stone-900 tracking-tight capitalize">
              {slug ? slug.replace('-', ' ') : 'The Bistro'}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Downtown Avenue
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Open Now
              </span>
            </div>
          </div>
          {table ? (
            <div className="bg-forest-900 text-amber-200 px-3 py-1.5 rounded-xl font-bold text-xs text-center shadow-sm">
              <span className="block text-[9px] uppercase tracking-wider text-forest-200">Seated At</span>
              Table {table}
            </div>
          ) : (
            <div className="bg-warm-100 text-warm-800 px-2.5 py-1 rounded-lg font-bold text-xs">
              Takeaway
            </div>
          )}
        </div>
      </div>

      {/* Search Input Placeholder */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search food, drinks, desserts..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-border rounded-xl text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-700"
          readOnly
        />
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {sampleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all
              ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-surface-border hover:bg-stone-50'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards List */}
      <div className="space-y-4">
        {previewItems.map((item) => (
          <Card key={item.id} className="p-3.5 flex gap-3.5 relative overflow-hidden">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-1.5 left-1.5">
                <Badge variant={item.isVeg ? 'veg' : 'non-veg'} size="sm" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="font-bold text-stone-900 text-sm leading-snug">{item.name}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="font-extrabold text-sm text-forest-950">
                  ${item.price.toFixed(2)}
                </span>
                <Button size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Floating Bottom Cart Bar Preview */}
      <div className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-30">
        <div className="bg-forest-950 text-white p-3.5 rounded-2xl shadow-float-bottom flex items-center justify-between border border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-amber-300 flex items-center justify-center font-bold text-xs relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warm-500 text-white text-[10px] flex items-center justify-center font-extrabold">
                1
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">1 item selected</div>
              <div className="text-[11px] text-emerald-300 font-semibold">$16.50 Total</div>
            </div>
          </div>
          <Button size="sm" variant="accent">
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
