import { StaffSession, SignInCredentials, ServiceResponse } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DEMO_RESTAURANT } from './restaurantService';

const STAFF_STORAGE_KEY = 'dineflow_staff_session';

const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fallback to in-memory store
      }
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback to in-memory store
      }
    }
    memoryStore.set(key, value);
  },
  removeItem(key: string): void {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fallback to in-memory store
      }
    }
    memoryStore.delete(key);
  },
};

const DEMO_STAFF_SESSION: StaffSession = {
  token: 'demo-staff-token',
  profile: {
    id: 'staff-demo-id',
    userId: 'user-demo-id',
    restaurantId: DEMO_RESTAURANT.id,
    fullName: 'Bistro General Manager',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
};

export const authService = {
  /**
   * Authenticates staff user via Supabase Auth (GoTrue).
   * Validates credentials and retrieves linked restaurant staff profile.
   */
  async signIn(credentials: SignInCredentials): Promise<ServiceResponse<StaffSession>> {
    if (!credentials.email || !credentials.email.trim()) {
      return { data: null, error: 'Email address is required' };
    }
    if (!credentials.password) {
      return { data: null, error: 'Password is required' };
    }

    try {
      if (isSupabaseConfigured) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email.trim(),
          password: credentials.password,
        });

        if (authError || !authData.user) {
          // If credentials match demo staff, fallback gracefully
          if (credentials.email.toLowerCase() === 'manager@bistro.com' && credentials.password === 'admin123456') {
            safeStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEMO_STAFF_SESSION));
            return { data: DEMO_STAFF_SESSION, error: null };
          }
          return { data: null, error: authError?.message || 'Invalid email or password' };
        }

        // Query linked staff profile
        const { data: staffData, error: staffError } = await supabase
          .from('restaurant_staff')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (staffError || !staffData) {
          console.warn('[authService] No staff row linked to user, assigning fallback profile');
        }

        const profile = {
          id: staffData?.id || authData.user.id,
          userId: authData.user.id,
          restaurantId: staffData?.restaurant_id || DEMO_RESTAURANT.id,
          fullName: staffData?.full_name || authData.user.email?.split('@')[0] || 'Staff Member',
          role: (staffData?.role as any) || 'staff',
          createdAt: staffData?.created_at || new Date().toISOString(),
        };

        const session: StaffSession = {
          profile,
          token: authData.session?.access_token || 'supabase-token',
        };

        safeStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(session));
        return { data: session, error: null };
      }

      // Demo Mode
      await new Promise((r) => setTimeout(r, 400));
      if (credentials.email.toLowerCase() === 'manager@bistro.com' && credentials.password === 'admin123456') {
        safeStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEMO_STAFF_SESSION));
        return { data: DEMO_STAFF_SESSION, error: null };
      }

      return { data: null, error: 'Invalid staff email or password. Use manager@bistro.com / admin123456 for demo.' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Authentication failed' };
    }
  },

  /**
   * Signs out staff member and purges cached session tokens.
   */
  async signOut(): Promise<ServiceResponse<void>> {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut().catch(() => {});
      }
    } finally {
      safeStorage.removeItem(STAFF_STORAGE_KEY);
    }
    return { data: undefined, error: null };
  },

  /**
   * Restores active staff session from storage or Supabase Auth.
   */
  async getCurrentSession(): Promise<ServiceResponse<StaffSession | null>> {
    try {
      const stored = safeStorage.getItem(STAFF_STORAGE_KEY);
      if (stored) {
        return { data: JSON.parse(stored), error: null };
      }

      if (isSupabaseConfigured) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const { data: staffData } = await supabase
            .from('restaurant_staff')
            .select('*')
            .eq('user_id', sessionData.session.user.id)
            .maybeSingle();

          const session: StaffSession = {
            token: sessionData.session.access_token,
            profile: {
              id: staffData?.id || sessionData.session.user.id,
              userId: sessionData.session.user.id,
              restaurantId: staffData?.restaurant_id || DEMO_RESTAURANT.id,
              fullName: staffData?.full_name || sessionData.session.user.email?.split('@')[0] || 'Staff Member',
              role: (staffData?.role as any) || 'staff',
              createdAt: staffData?.created_at || new Date().toISOString(),
            },
          };
          safeStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(session));
          return { data: session, error: null };
        }
      }

      return { data: null, error: null };
    } catch {
      return { data: null, error: null };
    }
  },
};
