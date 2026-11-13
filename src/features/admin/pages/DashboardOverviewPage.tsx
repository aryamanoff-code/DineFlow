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
  Radio,
} from 'lucide-react';
import { useLiveOrders } from '../hooks/useLiveOrders';
import { QuickMetricCard } from '../components/QuickMetricCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';

export const DashboardOverviewPage: React.FC = () => {
  const { orders, metrics, loading, error, refetch, updateStatus } = useLiveOrders();

  if (loading && orders.length === 0) {
    return (
      <LoadingState
        title="Loading Operations Overview"
        description="Fetching real-time sales and ticket activity..."
        fullHeight
      />
    );
  }

  if (error && orders.length === 0) {
    return (
      <ErrorState
        title="Could not load operations metrics"
        message={error}
        onRetry={refetch}
        fullHeight
      />
    );
  }

  // Recent 4 orders
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Realtime Live Indicator Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-surface-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-forest-950">
            Realtime Supabase Stream Active
          </span>
          <span className="text-xs text-stone-400">·</span>
          <span className="text-xs text-stone-600 font-medium">
            Live KDS synced across staff devices
          </span>
        </div>
        <Link to="/admin/orders">
          <Button size="sm" variant="accent" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Open Live KDS Board
          </Button>
        </Link>
      </div>

      {/* Dynamic Metric Cards (Computed from actual data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <QuickMetricCard
          title="Gross Sales Today"
          value={`$${metrics.totalSalesToday.toFixed(2)}`}
          subtext="From active & fulfilled tickets"
          icon={TrendingUp}
          accentColor="emerald"
        />

        <QuickMetricCard
          title="Total Orders Today"
          value={metrics.totalOrdersToday}
          subtext="Received since midnight"
          icon={ClipboardList}
          accentColor="stone"
        />

        <QuickMetricCard
          title="New / Pending"
          value={metrics.newOrders}
          subtext="Awaiting cook confirmation"
          icon={AlertTriangle}
          accentColor="amber"
        />

        <QuickMetricCard
          title="Currently Preparing"
          value={metrics.preparingOrders}
          subtext="Active in kitchen"
          icon={Clock}
          accentColor="sky"
        />

        <QuickMetricCard
          title="Completed Today"
          value={metrics.completedOrders}
          subtext="Fulfilled & served"
          icon={CheckCircle2}
          accentColor="emerald"
        />
      </div>

      {/* Quick Action Station */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/orders">
          <Card hoverable className="p-5 border-forest-900/10 hover:border-forest-900/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center shadow-xs">
                <Radio className="w-5 h-5 text-emerald-400" />
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
              <div className="w-10 h-10 rounded-xl bg-warm-500 text-white flex items-center justify-center shadow-xs">
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
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-xs">
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

      {/* Recent Orders Live Feed */}
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Recent Live Orders Feed</h2>
            <p className="text-xs text-stone-500">
              Live updates directly synchronized with customer mobile checkouts
            </p>
          </div>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All ({orders.length})
            </Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            No orders placed yet today.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-subtle font-mono text-xs font-bold text-stone-800 flex items-center justify-center shrink-0">
                    {ord.orderNumber}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>{ord.orderType === 'dine_in' ? `Table ${ord.tableNumber || '?'}` : 'Takeaway'}</span>
                      <span className="text-xs text-stone-400 font-normal">({ord.customerName})</span>
                    </div>
                    <div className="text-xs text-stone-500 truncate max-w-md">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-sm font-extrabold text-stone-900">
                    ${ord.totalAmount.toFixed(2)}
                  </span>
                  <Badge status={ord.status} size="sm" />
                  {ord.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateStatus(ord.id, 'preparing')}
                    >
                      Cook
                    </Button>
                  )}
                  {ord.status === 'preparing' && (
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => updateStatus(ord.id, 'ready')}
                    >
                      Ready
                    </Button>
                  )}
                  {ord.status === 'ready' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(ord.id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
