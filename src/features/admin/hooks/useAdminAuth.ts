import { useState, useEffect, useCallback } from 'react';
import { StaffSession, SignInCredentials } from '../../../types';
import { adminService } from '../utils/adminService';

export interface UseAdminAuthReturn {
  session: StaffSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginError: string | null;
  login: (credentials: SignInCredentials) => Promise<boolean>;
  logout: () => void;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [session, setSession] = useState<StaffSession | null>(() => adminService.getCurrentSession());
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const current = adminService.getCurrentSession();
    setSession(current);
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: SignInCredentials): Promise<boolean> => {
    setLoading(true);
    setLoginError(null);

    const res = await adminService.signIn(credentials);

    if (res.error || !res.data) {
      setLoginError(res.error || 'Failed to authenticate');
      setLoading(false);
      return false;
    }

    setSession(res.data);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    adminService.signOut();
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: Boolean(session),
    loading,
    loginError,
    login,
    logout,
  };
};
