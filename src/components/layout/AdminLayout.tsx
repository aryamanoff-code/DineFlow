import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Live Orders (KDS)', icon: ClipboardList, badge: 'Live' },
  { to: '/admin/menu', label: 'Menu Catalog', icon: UtensilsCrossed },
  { to: '/admin/settings', label: 'QR & Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Auth placeholder: redirect to login
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Operations Overview';
    if (location.pathname.startsWith('/admin/orders')) return 'Kitchen Display System (KDS)';
    if (location.pathname.startsWith('/admin/menu')) return 'Menu & Availability Manager';
    if (location.pathname.startsWith('/admin/settings')) return 'Restaurant Settings & QR Studio';
    return 'Admin Dashboard';
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-forest-950 text-white shrink-0 border-r border-forest-900 shadow-lg">
        {/* Brand identity */}
        <div className="p-6 border-b border-forest-900/80">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-amber-300 flex items-center justify-center font-bold shadow-inner">
              DF
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block text-white leading-none">
                DineFlow
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase block mt-1">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Live status badge */}
        <div className="px-6 py-3 bg-forest-900/50 flex items-center gap-2 border-b border-forest-900/60">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">Live WebSocket Connected</span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-300 hover:bg-forest-900 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Customer view shortcut & Staff session footer */}
        <div className="p-4 border-t border-forest-900/80 space-y-2">
          <Link
            to="/r/the-bistro?table=1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-forest-900 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Preview Diner Menu
            </span>
            <span className="text-[10px] text-amber-300">Table 1</span>
          </Link>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center font-bold text-xs text-amber-200">
                M
              </div>
              <div>
                <div className="text-xs font-bold text-white">Manager</div>
                <div className="text-[10px] text-stone-400">The Bistro Demo</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-stone-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-forest-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-forest-950 text-white p-4 flex items-center justify-between border-b border-forest-900">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest-800 text-amber-300 flex items-center justify-center font-bold text-sm">
            DF
          </div>
          <span className="font-extrabold text-base">DineFlow Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-forest-900 text-stone-200"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-900 text-white border-b border-forest-800 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold
                  ${isActive ? 'bg-emerald-600 text-white' : 'text-stone-200 hover:bg-forest-800'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:bg-forest-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">{getPageTitle()}</h1>
            <p className="text-xs text-stone-500 mt-0.5">Real-time local restaurant operations console</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Live
            </span>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
