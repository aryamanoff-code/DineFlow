import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { NotFoundPage } from '../components/layout/NotFoundPage';

// Customer Pages
import { LandingPage } from '../features/customer/pages/LandingPage';
import { MenuPage } from '../features/customer/pages/MenuPage';

// Admin Pages
import { LoginPage } from '../features/admin/pages/LoginPage';
import { DashboardOverviewPage } from '../features/admin/pages/DashboardOverviewPage';
import { OrdersPage } from '../features/admin/pages/OrdersPage';
import { MenuManagementPage } from '../features/admin/pages/MenuManagementPage';
import { SettingsPage } from '../features/admin/pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Domain */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/r" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":slug" element={<MenuPage />} />
        </Route>

        {/* Admin Staff Auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Management Domain */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
