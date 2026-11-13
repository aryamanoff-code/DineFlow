import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project-id')
);

if (!isSupabaseConfigured) {
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
