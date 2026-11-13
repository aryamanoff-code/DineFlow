import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variable resolver safe for both Vite and Node.js runtimes
const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
      return (import.meta.env as any)[key] || '';
    }
  } catch {}

  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch {}

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabasePublishableKey = getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[DineFlow] Supabase client initialized with placeholder credentials. ' +
    'Provide VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local for live data.'
  );
}

/**
 * Shared Supabase Client Instance.
 * Encapsulated inside the service layer as mandated by AGENTS.md.
 * UI components must consume service functions rather than this client directly.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
