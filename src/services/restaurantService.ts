import { Restaurant, ServiceResponse } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Fallback demo restaurant matching supabase/seed.sql
export const DEMO_RESTAURANT: Restaurant = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'The Bistro Downtown',
  slug: 'the-bistro',
  description: 'Artisan neighborhood kitchen serving wood-fired specialties, fresh pasta, and craft beverages.',
  address: '142 Market Street, Suite 100, Downtown',
  phone: '+1 (555) 234-5678',
  email: 'manager@bistro.com',
  currency: 'USD',
  isActive: true,
  createdAt: '2026-11-13T10:00:00Z',
  updatedAt: '2026-11-13T10:00:00Z',
};

const mapRestaurantRow = (row: any): Restaurant => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description || undefined,
  address: row.address || undefined,
  phone: row.phone || undefined,
  email: row.email || undefined,
  currency: row.currency || 'USD',
  isActive: Boolean(row.is_active),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const restaurantService = {
  /**
   * Retrieves restaurant profile by URL slug.
   * Publicly accessible per RLS policies.
   */
  async getRestaurantBySlug(slug: string): Promise<ServiceResponse<Restaurant>> {
    if (!slug || !slug.trim()) {
      return { data: null, error: 'A valid restaurant slug is required' };
    }

    const cleanSlug = slug.trim().toLowerCase();

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', cleanSlug)
          .maybeSingle();

        if (error) {
          console.warn('[restaurantService] Supabase query error:', error.message);
        } else if (data) {
          return { data: mapRestaurantRow(data), error: null };
        }
      }

      // Fallback to demo restaurant if slug matches or in demo mode
      if (cleanSlug === DEMO_RESTAURANT.slug || cleanSlug === 'demo') {
        return { data: DEMO_RESTAURANT, error: null };
      }

      return { data: null, error: `Restaurant "${slug}" not found or inactive` };
    } catch (err: any) {
      if (cleanSlug === DEMO_RESTAURANT.slug) {
        return { data: DEMO_RESTAURANT, error: null };
      }
      return { data: null, error: err.message || 'Unable to fetch restaurant' };
    }
  },

  /**
   * Retrieves restaurant profile by primary key UUID.
   */
  async getRestaurantById(id: string): Promise<ServiceResponse<Restaurant>> {
    if (!id || !id.trim()) {
      return { data: null, error: 'Restaurant ID is required' };
    }

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.warn('[restaurantService] Supabase query error:', error.message);
        } else if (data) {
          return { data: mapRestaurantRow(data), error: null };
        }
      }

      if (id === DEMO_RESTAURANT.id) {
        return { data: DEMO_RESTAURANT, error: null };
      }

      return { data: null, error: `Restaurant with ID ${id} not found` };
    } catch (err: any) {
      if (id === DEMO_RESTAURANT.id) {
        return { data: DEMO_RESTAURANT, error: null };
      }
      return { data: null, error: err.message || 'Unable to fetch restaurant' };
    }
  },
};
