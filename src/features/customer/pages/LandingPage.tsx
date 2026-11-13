import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Utensils, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-sand text-stone-900 flex flex-col justify-between">
      {/* Hero Header */}
      <header className="px-6 py-5 max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center shadow-md">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-forest-950">
            DineFlow
          </span>
        </div>
        <Link to="/admin/login">
          <Button variant="outline" size="sm">
            Staff Portal
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-900 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-warm-500" />
            Zero-App Digital Ordering for Local Restaurants
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950 leading-tight mb-4">
            Contactless Dining, <br />
            <span className="text-warm-600">Simplified.</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Patrons scan table QR codes to browse and order in seconds. Kitchen staff manage incoming tickets on a live WebSocket board.
          </p>
        </div>

        {/* Demo Experience Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full mb-12">
          {/* Diner Flow Showcase */}
          <Card className="flex flex-col justify-between border-2 border-forest-900/10 hover:border-forest-900/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center mb-4 shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">Customer Experience</h2>
              <p className="text-sm text-stone-600 mb-4">
                Experience the mobile-first customer view as if you scanned Table 4 at The Bistro.
              </p>
              <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border text-xs text-stone-500 mb-5">
                Route: <code className="text-forest-900 font-semibold">/r/the-bistro?table=4</code>
              </div>
            </div>
            <Link to="/r/the-bistro?table=4">
              <Button variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Diner Menu
              </Button>
            </Link>
          </Card>

          {/* Admin KDS Showcase */}
          <Card className="flex flex-col justify-between border-2 border-stone-200 hover:border-warm-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-warm-500 text-white flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">Restaurant Admin & KDS</h2>
              <p className="text-sm text-stone-600 mb-4">
                Explore the live kitchen display system, menu availability editor, and table QR studio.
              </p>
              <div className="bg-surface-subtle p-3 rounded-xl border border-surface-border text-xs text-stone-500 mb-5">
                Route: <code className="text-warm-700 font-semibold">/admin/orders</code>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="accent" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Open Admin Dashboard
              </Button>
            </Link>
          </Card>
        </div>

        {/* Quick Table Jump Shortcuts */}
        <div className="text-center bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-surface-border max-w-xl mx-auto w-full">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
            Quick Table QR Simulation
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[1, 2, 3, 4, 8, 12].map((num) => (
              <Link key={num} to={`/r/the-bistro?table=${num}`}>
                <span className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-forest-50 border border-surface-border hover:border-forest-200 text-xs font-semibold text-stone-700 hover:text-forest-900 transition-all">
                  Table {num}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-stone-400 border-t border-surface-border">
        DineFlow Platform · 12-Hour Hackathon Architecture
      </footer>
    </div>
  );
};
