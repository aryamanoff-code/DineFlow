import React, { useState } from 'react';
import { Radio, Clock, Check, ChefHat, Bell } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { OrderStatus } from '../../../types';

interface MockKDSTicket {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  status: OrderStatus;
  elapsedMinutes: number;
  items: Array<{ name: string; quantity: number; notes?: string }>;
  totalAmount: number;
}

export const OrdersPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Preview mock tickets for layout presentation (feature phase will hook into useLiveOrders)
  const [tickets, setTickets] = useState<MockKDSTicket[]>([
    {
      id: 'ord-1',
      orderNumber: '#104',
      tableNumber: 'Table 4',
      customerName: 'Alex M.',
      status: 'pending',
      elapsedMinutes: 3,
      items: [
        { name: 'Classic Truffle Burger', quantity: 2, notes: 'Extra crispy fries' },
        { name: 'House Brewed Iced Tea', quantity: 1, notes: 'Less ice' },
      ],
      totalAmount: 37.00,
    },
    {
      id: 'ord-2',
      orderNumber: '#103',
      tableNumber: 'Table 2',
      customerName: 'Sarah K.',
      status: 'preparing',
      elapsedMinutes: 11,
      items: [
        { name: 'Wild Mushroom Risotto', quantity: 1 },
      ],
      totalAmount: 14.00,
    },
    {
      id: 'ord-3',
      orderNumber: '#102',
      tableNumber: 'Takeaway',
      customerName: 'David L.',
      status: 'ready',
      elapsedMinutes: 18,
      items: [
        { name: 'Crispy Rosemary Bruschetta', quantity: 3 },
      ],
      totalAmount: 28.50,
    },
  ]);

  const handleAdvanceStatus = (ticketId: string, nextStatus: OrderStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) => {
    if (selectedFilter === 'all') return true;
    return t.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* KDS Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Live Supabase WebSocket Stream Active
          </div>
          <span className="text-xs text-stone-500">
            {tickets.length} active tickets
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'preparing', 'ready'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${
                  selectedFilter === f
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className={`
              p-5 flex flex-col justify-between border-2 transition-all shadow-sm
              ${
                ticket.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/20'
                  : ticket.status === 'preparing'
                  ? 'border-sky-300 bg-sky-50/20'
                  : 'border-emerald-300 bg-emerald-50/20'
              }
            `}
          >
            <div>
              {/* Ticket Top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-stone-900">
                    {ticket.orderNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-xs font-bold text-stone-800">
                    {ticket.tableNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                    <Clock className="w-3 h-3" />
                    {ticket.elapsedMinutes}m ago
                  </span>
                  <Badge status={ticket.status} size="sm" />
                </div>
              </div>

              {/* Customer Info */}
              <div className="text-xs text-stone-500 mb-3">
                Customer: <span className="font-semibold text-stone-800">{ticket.customerName}</span>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                      <span>{item.name}</span>
                      <span className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center font-mono">
                        x{item.quantity}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="text-[11px] font-medium text-warm-700 mt-1 italic">
                        Note: "{item.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Footer Action */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <span className="font-extrabold text-sm text-stone-900">
                ${ticket.totalAmount.toFixed(2)}
              </span>

              {ticket.status === 'pending' && (
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<ChefHat className="w-3.5 h-3.5" />}
                  onClick={() => handleAdvanceStatus(ticket.id, 'preparing')}
                >
                  Start Preparing
                </Button>
              )}

              {ticket.status === 'preparing' && (
                <Button
                  size="sm"
                  variant="accent"
                  leftIcon={<Bell className="w-3.5 h-3.5" />}
                  onClick={() => handleAdvanceStatus(ticket.id, 'ready')}
                >
                  Mark as Ready
                </Button>
              )}

              {ticket.status === 'ready' && (
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Check className="w-3.5 h-3.5 text-emerald-600" />}
                  onClick={() => handleAdvanceStatus(ticket.id, 'completed')}
                >
                  Complete Order
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
