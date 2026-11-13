import { MenuCategory, MenuItem, ServiceResponse } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DEMO_RESTAURANT } from './restaurantService';

// Default categories and menu items matching supabase/seed.sql
export const DEMO_CATEGORIES: MenuCategory[] = [
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', restaurantId: DEMO_RESTAURANT.id, name: 'Starters', displayOrder: 1, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', restaurantId: DEMO_RESTAURANT.id, name: 'Main Course', displayOrder: 2, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', restaurantId: DEMO_RESTAURANT.id, name: 'Beverages', displayOrder: 3, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', restaurantId: DEMO_RESTAURANT.id, name: 'Desserts', displayOrder: 4, createdAt: '2026-11-13T10:00:00Z' },
];

export const DEMO_ITEMS: MenuItem[] = [
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    name: 'Crispy Rosemary Bruschetta',
    description: 'Charred artisan sourdough baguette topped with heirloom cherry tomatoes, fresh basil, garlic-infused olive oil, and balsamic glaze.',
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    name: 'Truffle Parmesan Hand-Cut Fries',
    description: 'Crispy Idaho potatoes tossed in white truffle oil, grated 24-month Parmigiano-Reggiano, and chopped wild chives.',
    price: 8.00,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    name: 'Crispy Calamari Fritti',
    description: 'Tender Monterey squid lightly crusted, tossed with fried cherry peppers, served with charred lemon aioli.',
    price: 12.50,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    name: 'Classic Truffle Burger',
    description: 'Half-pound aged Prime Angus beef patty, shaved black summer truffles, aged Gruyere cheese, caramelized onions on toasted brioche.',
    price: 16.50,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    name: 'Wild Forest Mushroom Risotto',
    description: 'Creamy Carnaroli rice slowly cooked in vegetable herb broth with porcini mushrooms, baby leeks, and Pecorino Romano.',
    price: 14.00,
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    name: 'Wood-Fired Margherita Pizza',
    description: 'San Marzano tomato sauce, hand-pulled fresh buffalo mozzarella, fresh basil, and extra virgin olive oil on slow-fermented crust.',
    price: 13.50,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c07',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    name: 'Braised Angus Short Rib',
    description: '12-hour red wine braised beef short rib served over creamy polenta with glazed baby carrots and natural jus.',
    price: 24.00,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isVeg: false,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c08',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    name: 'House Brewed Citrus Iced Tea',
    description: 'Slow-steeped Earl Grey tea infused with fresh orange zest, Meyer lemon slices, and organic cane sugar.',
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c09',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    name: 'Cold-Pressed Ginger Lemonade',
    description: 'Fresh pressed ginger root, Sicilian lemons, filtered sparkling spring water, lightly sweetened with agave.',
    price: 5.00,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    name: 'Nitro Cold Brew Coffee',
    description: 'Single-origin Ethiopian Yirgacheffe cold brew infused with nitrogen for a velvety, creamy cascade.',
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: false, // 86'd / Sold out
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    name: 'Warm Belgian Chocolate Lava Cake',
    description: 'Dark Valrhona chocolate cake with molten center, accompanied by Madagascar vanilla bean gelato and raspberry coulis.',
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: true,
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    name: 'Tahitian Vanilla Bean Panna Cotta',
    description: 'Silky chilled cream dessert infused with real vanilla bean, topped with seasonal macerated blackberries.',
    price: 7.50,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: false, // 86'd / Sold out
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
];

let liveItemsStore: MenuItem[] = [...DEMO_ITEMS];

const mapCategoryRow = (row: any): MenuCategory => ({
  id: row.id,
  restaurantId: row.restaurant_id,
  name: row.name,
  displayOrder: row.display_order,
  createdAt: row.created_at,
});

const mapMenuItemRow = (row: any): MenuItem => ({
  id: row.id,
  restaurantId: row.restaurant_id,
  categoryId: row.category_id,
  name: row.name,
  description: row.description || undefined,
  price: Number(row.price),
  imageUrl: row.image_url || undefined,
  isVeg: Boolean(row.is_veg),
  isAvailable: Boolean(row.is_available),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const menuService = {
  /**
   * Retrieves all categories for a given restaurant ID.
   */
  async getMenuCategories(restaurantId: string): Promise<ServiceResponse<MenuCategory[]>> {
    if (!restaurantId) return { data: null, error: 'Restaurant ID is required' };

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });

        if (error) {
          console.warn('[menuService.getMenuCategories] Supabase error:', error.message);
        } else if (data) {
          return { data: data.map(mapCategoryRow), error: null };
        }
      }

      return { data: DEMO_CATEGORIES.filter((c) => c.restaurantId === restaurantId || restaurantId === DEMO_RESTAURANT.id), error: null };
    } catch (err: any) {
      return { data: DEMO_CATEGORIES, error: null };
    }
  },

  /**
   * Retrieves the complete menu (categories + items) for a restaurant.
   */
  async getMenu(restaurantId: string): Promise<ServiceResponse<{ categories: MenuCategory[]; items: MenuItem[] }>> {
    if (!restaurantId) return { data: null, error: 'Restaurant ID is required' };

    try {
      if (isSupabaseConfigured) {
        const [categoriesRes, itemsRes] = await Promise.all([
          supabase
            .from('menu_categories')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('display_order', { ascending: true }),
          supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false }),
        ]);

        if (categoriesRes.error || itemsRes.error) {
          console.warn('[menuService.getMenu] Query warning, checking fallback');
        } else if (categoriesRes.data && itemsRes.data) {
          return {
            data: {
              categories: categoriesRes.data.map(mapCategoryRow),
              items: itemsRes.data.map(mapMenuItemRow),
            },
            error: null,
          };
        }
      }

      return {
        data: {
          categories: DEMO_CATEGORIES,
          items: liveItemsStore,
        },
        error: null,
      };
    } catch {
      return {
        data: {
          categories: DEMO_CATEGORIES,
          items: liveItemsStore,
        },
        error: null,
      };
    }
  },

  /**
   * Toggles menu item availability (86'd status).
   * Enforces RLS: Requires authenticated restaurant staff.
   */
  async setMenuItemAvailability(itemId: string, isAvailable: boolean): Promise<ServiceResponse<MenuItem>> {
    if (!itemId) return { data: null, error: 'Item ID is required' };

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('menu_items')
          .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
          .eq('id', itemId)
          .select()
          .single();

        if (error) {
          return { data: null, error: error.message };
        }
        return { data: mapMenuItemRow(data), error: null };
      }

      // Memory update
      const match = liveItemsStore.find((i) => i.id === itemId);
      if (match) {
        match.isAvailable = isAvailable;
        match.updatedAt = new Date().toISOString();
        return { data: { ...match }, error: null };
      }
      return { data: null, error: 'Item not found' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Unable to update availability' };
    }
  },

  /**
   * Creates or updates a menu item.
   * Enforces RLS: Requires authenticated restaurant staff.
   */
  async saveMenuItem(
    payload: Partial<MenuItem> & { restaurantId: string; name: string; price: number; categoryId: string }
  ): Promise<ServiceResponse<MenuItem>> {
    if (!payload.name || !payload.name.trim()) {
      return { data: null, error: 'Dish name is required' };
    }
    if (payload.price === undefined || payload.price < 0) {
      return { data: null, error: 'Valid price (>= 0) is required' };
    }
    if (!payload.categoryId) {
      return { data: null, error: 'Category ID is required' };
    }

    try {
      if (isSupabaseConfigured) {
        if (payload.id) {
          // Update
          const { data, error } = await supabase
            .from('menu_items')
            .update({
              name: payload.name.trim(),
              description: payload.description?.trim() || null,
              price: payload.price,
              image_url: payload.imageUrl?.trim() || null,
              is_veg: payload.isVeg ?? false,
              category_id: payload.categoryId,
              is_available: payload.isAvailable ?? true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payload.id)
            .select()
            .single();

          if (error) return { data: null, error: error.message };
          return { data: mapMenuItemRow(data), error: null };
        } else {
          // Insert
          const { data, error } = await supabase
            .from('menu_items')
            .insert({
              restaurant_id: payload.restaurantId,
              category_id: payload.categoryId,
              name: payload.name.trim(),
              description: payload.description?.trim() || null,
              price: payload.price,
              image_url: payload.imageUrl?.trim() || null,
              is_veg: payload.isVeg ?? false,
              is_available: payload.isAvailable ?? true,
            })
            .select()
            .single();

          if (error) return { data: null, error: error.message };
          return { data: mapMenuItemRow(data), error: null };
        }
      }

      // Memory mode
      if (payload.id) {
        const idx = liveItemsStore.findIndex((i) => i.id === payload.id);
        if (idx > -1) {
          liveItemsStore[idx] = {
            ...liveItemsStore[idx],
            ...payload,
            updatedAt: new Date().toISOString(),
          };
          return { data: { ...liveItemsStore[idx] }, error: null };
        }
      }

      const newItem: MenuItem = {
        id: `mock-item-${Date.now()}`,
        restaurantId: payload.restaurantId,
        categoryId: payload.categoryId,
        name: payload.name.trim(),
        description: payload.description || '',
        price: payload.price,
        imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isVeg: payload.isVeg ?? false,
        isAvailable: payload.isAvailable ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      liveItemsStore.unshift(newItem);
      return { data: newItem, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to save menu item' };
    }
  },

  /**
   * Deletes a menu item.
   */
  async deleteMenuItem(itemId: string): Promise<ServiceResponse<boolean>> {
    if (!itemId) return { data: false, error: 'Item ID is required' };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
        if (error) return { data: false, error: error.message };
        return { data: true, error: null };
      }

      liveItemsStore = liveItemsStore.filter((i) => i.id !== itemId);
      return { data: true, error: null };
    } catch (err: any) {
      return { data: false, error: err.message };
    }
  },
};
