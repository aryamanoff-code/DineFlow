import React, { useState } from 'react';
import { Store, QrCode } from 'lucide-react';
import { QRPrintView } from '../components/QRPrintView';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { adminService } from '../utils/adminService';

export const SettingsPage: React.FC = () => {
  const [tableNumber, setTableNumber] = useState('4');
  const [restaurantName] = useState('The Bistro Downtown');
  const [restaurantSlug] = useState(adminService.getRestaurantSlug());
  const [isGeneralMenu, setIsGeneralMenu] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const qrUrl = isGeneralMenu
    ? `${origin}/r/${restaurantSlug}`
    : `${origin}/r/${restaurantSlug}?table=${encodeURIComponent(tableNumber.trim())}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Studio */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Table QR Code Studio</h2>
                <p className="text-xs text-stone-500">
                  Generate, preview, print, or download table-specific QR stands
                </p>
              </div>
            </div>

            {/* QR Mode Toggle */}
            <div className="flex gap-2 p-1 bg-surface-sand rounded-xl border border-surface-border mb-4 text-xs">
              <button
                type="button"
                onClick={() => setIsGeneralMenu(false)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  !isGeneralMenu ? 'bg-forest-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Table-Specific Stand
              </button>
              <button
                type="button"
                onClick={() => setIsGeneralMenu(true)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  isGeneralMenu ? 'bg-forest-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                General Restaurant QR
              </button>
            </div>

            {/* Table Number Selection (If Table-Specific) */}
            {!isGeneralMenu && (
              <div className="space-y-2 mb-4">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Table Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. 4 or Patio-2"
                    className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-800"
                  />
                  <div className="flex gap-1 shrink-0">
                    {['1', '2', '3', '4', '8', '12'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTableNumber(num)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                          tableNumber === num
                            ? 'bg-forest-900 text-white border-forest-900'
                            : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                        }`}
                      >
                        T{num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive QR Display & Export Component */}
            <QRPrintView
              restaurantName={restaurantName}
              tableNumber={isGeneralMenu ? '' : tableNumber}
              qrUrl={qrUrl}
            />
          </div>
        </Card>

        {/* Restaurant Configuration */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warm-500 text-white flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Restaurant Details & Setup</h2>
                <p className="text-xs text-stone-500">Business identification and active menu URL</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Restaurant Trading Name
                </label>
                <input
                  type="text"
                  defaultValue={restaurantName}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Menu URL Slug
                </label>
                <input
                  type="text"
                  defaultValue={restaurantSlug}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-600 font-semibold"
                  readOnly
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Live menu route: <code className="text-forest-900 font-bold">/r/{restaurantSlug}</code>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    defaultValue="USD ($)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Fulfillment Modes
                  </label>
                  <input
                    type="text"
                    defaultValue="Dine-In & Takeaway"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  defaultValue="142 Market Street, Suite 100, Downtown"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
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
