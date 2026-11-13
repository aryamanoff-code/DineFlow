import React, { useState } from 'react';
import { Plus, Search, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface MockMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
}

export const MenuManagementPage: React.FC = () => {
  const [items, setItems] = useState<MockMenuItem[]>([
    {
      id: 'm1',
      name: 'Classic Truffle Burger',
      category: 'Main Course',
      price: 16.50,
      isVeg: false,
      isAvailable: true,
    },
    {
      id: 'm2',
      name: 'Wild Mushroom Risotto',
      category: 'Main Course',
      price: 14.00,
      isVeg: true,
      isAvailable: true,
    },
    {
      id: 'm3',
      name: 'Crispy Rosemary Bruschetta',
      category: 'Starters',
      price: 9.50,
      isVeg: true,
      isAvailable: true,
    },
    {
      id: 'm4',
      name: 'House Brewed Iced Tea',
      category: 'Beverages',
      price: 4.50,
      isVeg: true,
      isAvailable: false, // 86'd
    },
  ]);

  const toggleAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
            readOnly
          />
        </div>

        <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Menu Item
        </Button>
      </div>

      {/* 86'd Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Instant 86'd Stock Control:</span> Toggling availability instantly disables the dish on live diner menus without reprinting.
          </div>
        </div>
      </div>

      {/* Menu Table Card */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-surface-border text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Dish Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5 text-center">Availability (Live)</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    !item.isAvailable ? 'bg-stone-50/60 opacity-80' : ''
                  }`}
                >
                  <td className="px-5 py-4 font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {!item.isAvailable && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                          86'd
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{item.category}</td>
                  <td className="px-5 py-4">
                    <Badge variant={item.isVeg ? 'veg' : 'non-veg'} size="sm" />
                  </td>
                  <td className="px-5 py-4 font-extrabold text-stone-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all
                        ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }
                      `}
                    >
                      {item.isAvailable ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> In Stock
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> Sold Out
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3 h-3" />}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
