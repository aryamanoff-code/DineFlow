import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Utensils, Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin';
  const { login, loginError, loading, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('manager@bistro.com');
  const [password, setPassword] = useState('admin123456');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email: email.trim(), password });
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center p-4 sm:p-6 text-stone-100">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-amber-300 border border-forest-800 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Utensils className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">DineFlow Staff Portal</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Sign in to access real-time kitchen orders & menu governance
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white text-stone-900 border-none shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 font-medium"
                  placeholder="manager@bistro.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Credentials Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authorized Account:</span> Use{' '}
                <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">
                  manager@bistro.com
                </code>{' '}
                with password{' '}
                <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">
                  admin123456
                </code>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-stone-400 hover:text-white transition-colors">
            ← Return to Customer Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
