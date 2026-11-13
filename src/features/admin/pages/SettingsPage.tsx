import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, Store, ExternalLink } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [tableNumber, setTableNumber] = useState('4');
  const [restaurantSlug] = useState('the-bistro');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const qrUrl = `${origin}/r/${restaurantSlug}?table=${encodeURIComponent(tableNumber)}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator Studio */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Table QR Code Studio</h2>
                <p className="text-xs text-stone-500">Generate printable QR stands for dining tables</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Select Table Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-bold"
                    placeholder="e.g. 4 or Patio-2"
                  />
                  <div className="flex gap-1">
                    {[1, 2, 4, 8].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTableNumber(t.toString())}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-surface-subtle border border-surface-border hover:bg-stone-200 text-stone-700"
                      >
                        T{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live QR Render Card */}
              <div className="bg-surface-sand p-6 rounded-2xl border border-surface-border flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-200 mb-3">
                  <QRCodeSVG
                    value={qrUrl}
                    size={160}
                    level="H"
                    includeMargin={false}
                    fgColor="#0F3E2E"
                  />
                </div>
                <div className="text-xs font-extrabold text-forest-950 uppercase tracking-wider">
                  The Bistro · Table {tableNumber}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 truncate max-w-xs font-mono">
                  {qrUrl}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print Table Stand
            </Button>
            <a href={qrUrl} target="_blank" rel="noreferrer" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Test Link
              </Button>
            </a>
          </div>
        </Card>

        {/* Restaurant Configuration */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warm-500 text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Restaurant Settings</h2>
                <p className="text-xs text-stone-500">Business details and public menu configuration</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Restaurant Trading Name
                </label>
                <input
                  type="text"
                  defaultValue="The Bistro Downtown"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Menu URL Slug
                </label>
                <input
                  type="text"
                  defaultValue="the-bistro"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-600"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    defaultValue="USD ($)"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Operating Mode
                  </label>
                  <input
                    type="text"
                    defaultValue="Dine-In & Takeaway"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button variant="secondary" size="sm" fullWidth>
              Save Configuration Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
