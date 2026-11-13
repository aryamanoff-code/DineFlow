import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  UtensilsCrossed,
  QrCode,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const DashboardOverviewPage: React.FC = () => {
  const metrics = [
    {
      title: "Today's Gross Sales",
      value: '$1,248.50',
      change: '+14% vs yesterday',
      icon: TrendingUp,
      accent: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Active Orders (KDS)',
      value: '4 Tickets',
      change: '2 preparing · 2 pending',
      icon: Clock,
      accent: 'text-amber-700 bg-amber-50',
    },
    {
      title: 'Completed Orders',
      value: '38 Orders',
      change: '97% fulfillment rate',
      icon: CheckCircle2,
      accent: 'text-sky-700 bg-sky-50',
    },
    {
      title: '86’d (Out of Stock)',
      value: '2 Items',
      change: 'Auto-hidden from menu',
      icon: AlertTriangle,
      accent: 'text-rose-700 bg-rose-50',
    },
  ];

  const recentOrders = [
    { id: 'ORD-104', table: 'Table 4', items: '2x Truffle Burger, 1x Iced Tea', total: '$37.00', status: 'pending' as const },
    { id: 'ORD-103', table: 'Table 2', items: '1x Mushroom Risotto', total: '$14.00', status: 'preparing' as const },
    { id: 'ORD-102', table: 'Takeaway', items: '3x Rosemary Bruschetta', total: '$28.50', status: 'ready' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {m.title}
                </span>
                <div className={`p-2 rounded-xl ${m.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-stone-900 tracking-tight">{m.value}</div>
              <div className="text-xs text-stone-500 mt-1 font-medium">{m.change}</div>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Station */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/orders">
          <Card hoverable className="p-5 border-forest-900/10 hover:border-forest-900/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Live Kitchen Board</h3>
                <span className="text-xs text-stone-500">Manage real-time tickets</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              View incoming orders, accept tickets, and advance preparation stages.
            </p>
          </Card>
        </Link>

        <Link to="/admin/menu">
          <Card hoverable className="p-5 border-stone-200 hover:border-warm-400">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warm-500 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Menu & Prices</h3>
                <span className="text-xs text-stone-500">Toggle item availability</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              Update pricing and instantly mark sold-out items to prevent customer disappointment.
            </p>
          </Card>
        </Link>

        <Link to="/admin/settings">
          <Card hoverable className="p-5 border-stone-200 hover:border-forest-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">QR Code Studio</h3>
                <span className="text-xs text-stone-500">Print table codes</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-2">
              Generate and download high-resolution QR codes mapped to specific dining tables.
            </p>
          </Card>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Recent Live Orders</h2>
            <p className="text-xs text-stone-500">Latest incoming tickets from customer tables</p>
          </div>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Full KDS
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-stone-100">
          {recentOrders.map((ord) => (
            <div key={ord.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-subtle font-mono text-xs font-bold text-stone-700 flex items-center justify-center">
                  {ord.id}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{ord.table}</div>
                  <div className="text-xs text-stone-500">{ord.items}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-extrabold text-stone-900">{ord.total}</span>
                <Badge status={ord.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
