import {
  Restaurant,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  StaffSession,
  SignInCredentials,
  ServiceResponse,
} from '../../../types';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const STAFF_SESSION_KEY = 'dineflow_staff_session';

// ============================================================================
// In-Memory Seed Storage for Live State Simulation
// ============================================================================

const DEMO_RESTAURANT: Restaurant = {
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

const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', restaurantId: DEMO_RESTAURANT.id, name: 'Starters', displayOrder: 1, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', restaurantId: DEMO_RESTAURANT.id, name: 'Main Course', displayOrder: 2, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', restaurantId: DEMO_RESTAURANT.id, name: 'Beverages', displayOrder: 3, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', restaurantId: DEMO_RESTAURANT.id, name: 'Desserts', displayOrder: 4, createdAt: '2026-11-13T10:00:00Z' },
];

let inMemoryCategories = [...DEFAULT_CATEGORIES];

let inMemoryItems: MenuItem[] = [
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
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10',
    restaurantId: DEMO_RESTAURANT.id,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    name: 'Nitro Cold Brew Coffee',
    description: 'Single-origin Ethiopian Yirgacheffe cold brew infused with nitrogen for a velvety, creamy cascade.',
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    isVeg: true,
    isAvailable: false, // 86'd
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
  },
];

let inMemoryOrders: Order[] = [
  {
    id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    restaurantId: DEMO_RESTAURANT.id,
    orderNumber: '#104',
    orderType: 'dine_in',
    tableNumber: '4',
    customerName: 'Alex Miller',
    customerPhone: '+1 (555) 987-6543',
    items: [
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', name: 'Classic Truffle Burger', price: 16.50, quantity: 2, instructions: 'Extra crispy fries please' },
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c08', name: 'House Brewed Citrus Iced Tea', price: 4.50, quantity: 1, instructions: 'Light ice' },
    ],
    subtotal: 37.50,
    taxAmount: 0.00,
    totalAmount: 37.50,
    status: 'pending',
    notes: 'First time diners - seating near window.',
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d02',
    restaurantId: DEMO_RESTAURANT.id,
    orderNumber: '#103',
    orderType: 'dine_in',
    tableNumber: '2',
    customerName: 'Sarah Jenkins',
    customerPhone: '+1 (555) 345-6789',
    items: [
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05', name: 'Wild Forest Mushroom Risotto', price: 14.00, quantity: 1 },
    ],
    subtotal: 14.00,
    taxAmount: 0.00,
    totalAmount: 14.00,
    status: 'preparing',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03',
    restaurantId: DEMO_RESTAURANT.id,
    orderNumber: '#102',
    orderType: 'takeaway',
    tableNumber: null,
    customerName: 'David Lee',
    customerPhone: '+1 (555) 456-7890',
    items: [
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', name: 'Crispy Rosemary Bruschetta', price: 9.50, quantity: 3, instructions: 'Separate box' },
    ],
    subtotal: 28.50,
    taxAmount: 0.00,
    totalAmount: 28.50,
    status: 'ready',
    notes: 'Customer waiting outside in car.',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d04',
    restaurantId: DEMO_RESTAURANT.id,
    orderNumber: '#101',
    orderType: 'dine_in',
    tableNumber: '1',
    customerName: 'Elena Rostova',
    items: [
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', name: 'Truffle Parmesan Hand-Cut Fries', price: 8.00, quantity: 1 },
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', name: 'Classic Truffle Burger', price: 16.50, quantity: 1 },
    ],
    subtotal: 24.50,
    taxAmount: 0.00,
    totalAmount: 24.50,
    status: 'completed',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

// ============================================================================
// Admin Service API
// ============================================================================

export const adminService = {
  // --------------------------------------------------------------------------
  // 1. Staff Authentication
  // --------------------------------------------------------------------------
  async signIn(credentials: SignInCredentials): Promise<ServiceResponse<StaffSession>> {
    try {
      if (isSupabaseConfigured) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError || !authData.user) {
          // If Supabase returns error, check if email matches demo credentials for fallback
          if (credentials.email === 'manager@bistro.com') {
            const fallbackSession: StaffSession = {
              token: 'demo-jwt-token',
              profile: {
                id: 'staff-demo-id',
                userId: 'user-demo-id',
                restaurantId: DEMO_RESTAURANT.id,
                fullName: 'Bistro General Manager',
                role: 'admin',
                createdAt: new Date().toISOString(),
              },
            };
            localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(fallbackSession));
            return { data: fallbackSession, error: null };
          }
          return { data: null, error: authError?.message || 'Invalid credentials' };
        }

        // Fetch staff profile linked to this user
        const { data: staffData } = await supabase
          .from('restaurant_staff')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        const profile = {
          id: staffData?.id || authData.user.id,
          userId: authData.user.id,
          restaurantId: staffData?.restaurant_id || DEMO_RESTAURANT.id,
          fullName: staffData?.full_name || authData.user.email?.split('@')[0] || 'Staff Member',
          role: (staffData?.role as any) || 'admin',
          createdAt: staffData?.created_at || new Date().toISOString(),
        };

        const session: StaffSession = {
          profile,
          token: authData.session?.access_token || 'supabase-token',
        };

        localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(session));
        return { data: session, error: null };
      }

      // Offline / Unconfigured Demo mode
      await new Promise((r) => setTimeout(r, 400));
      if (credentials.email.toLowerCase().includes('bistro') || credentials.email === 'manager@bistro.com') {
        const session: StaffSession = {
          token: 'demo-staff-session-token',
          profile: {
            id: 'staff-1',
            userId: 'user-1',
            restaurantId: DEMO_RESTAURANT.id,
            fullName: 'Bistro Operations Manager',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
        };
        localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(session));
        return { data: session, error: null };
      }

      return { data: null, error: 'Invalid staff email or password. Use manager@bistro.com for demo.' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Login failed' };
    }
  },

  signOut(): void {
    try {
      if (isSupabaseConfigured) {
        supabase.auth.signOut().catch(() => {});
      }
    } finally {
      localStorage.removeItem(STAFF_SESSION_KEY);
    }
  },

  getCurrentSession(): StaffSession | null {
    try {
      const stored = localStorage.getItem(STAFF_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // --------------------------------------------------------------------------
  // 2. Live Order Management & KDS
  // --------------------------------------------------------------------------
  async fetchLiveOrders(restaurantId: string): Promise<ServiceResponse<Order[]>> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mappedOrders: Order[] = data.map((o: any) => ({
            id: o.id,
            restaurantId: o.restaurant_id,
            orderNumber: o.order_number,
            orderType: o.order_type,
            tableNumber: o.table_number,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            subtotal: Number(o.subtotal || o.total_amount),
            taxAmount: Number(o.tax_amount || 0),
            totalAmount: Number(o.total_amount),
            status: o.status,
            notes: o.notes,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));
          return { data: mappedOrders, error: null };
        }
      }

      // Memory fallback
      await new Promise((r) => setTimeout(r, 200));
      return { data: [...inMemoryOrders], error: null };
    } catch (err: any) {
      return { data: [...inMemoryOrders], error: null };
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ServiceResponse<Order>> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .select()
          .single();

        if (!error && data) {
          const updated: Order = {
            id: data.id,
            restaurantId: data.restaurant_id,
            orderNumber: data.order_number,
            orderType: data.order_type,
            tableNumber: data.table_number,
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items,
            subtotal: Number(data.subtotal || data.total_amount),
            taxAmount: Number(data.tax_amount || 0),
            totalAmount: Number(data.total_amount),
            status: data.status,
            notes: data.notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          return { data: updated, error: null };
        }
      }

      // In-memory update
      const target = inMemoryOrders.find((o) => o.id === orderId);
      if (target) {
        target.status = status;
        target.updatedAt = new Date().toISOString();
        return { data: { ...target }, error: null };
      }
      return { data: null, error: 'Order not found' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to update order status' };
    }
  },

  subscribeToLiveOrders(
    restaurantId: string,
    onInsert: (order: Order) => void,
    onUpdate: (order: Order) => void
  ): () => void {
    if (!isSupabaseConfigured) {
      return () => {};
    }

    const channel = supabase
      .channel(`realtime:orders:${restaurantId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        (payload) => {
          const o = payload.new as any;
          const mapped: Order = {
            id: o.id,
            restaurantId: o.restaurant_id,
            orderNumber: o.order_number,
            orderType: o.order_type,
            tableNumber: o.table_number,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            subtotal: Number(o.subtotal || o.total_amount),
            taxAmount: Number(o.tax_amount || 0),
            totalAmount: Number(o.total_amount),
            status: o.status,
            notes: o.notes,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          };
          onInsert(mapped);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        (payload) => {
          const o = payload.new as any;
          const mapped: Order = {
            id: o.id,
            restaurantId: o.restaurant_id,
            orderNumber: o.order_number,
            orderType: o.order_type,
            tableNumber: o.table_number,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            subtotal: Number(o.subtotal || o.total_amount),
            taxAmount: Number(o.tax_amount || 0),
            totalAmount: Number(o.total_amount),
            status: o.status,
            notes: o.notes,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          };
          onUpdate(mapped);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // --------------------------------------------------------------------------
  // 3. Menu Management
  // --------------------------------------------------------------------------
  async fetchMenu(restaurantId: string): Promise<ServiceResponse<{ categories: MenuCategory[]; items: MenuItem[] }>> {
    try {
      if (isSupabaseConfigured) {
        const { data: catData } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order', { ascending: true });

        const { data: itemData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });

        if (catData && itemData) {
          const categories: MenuCategory[] = catData.map((c: any) => ({
            id: c.id,
            restaurantId: c.restaurant_id,
            name: c.name,
            displayOrder: c.display_order,
            createdAt: c.created_at,
          }));

          const items: MenuItem[] = itemData.map((i: any) => ({
            id: i.id,
            restaurantId: i.restaurant_id,
            categoryId: i.category_id,
            name: i.name,
            description: i.description,
            price: Number(i.price),
            imageUrl: i.image_url,
            isVeg: i.is_veg,
            isAvailable: i.is_available,
            createdAt: i.created_at,
            updatedAt: i.updated_at,
          }));

          return { data: { categories, items }, error: null };
        }
      }

      return {
        data: {
          categories: [...inMemoryCategories],
          items: [...inMemoryItems],
        },
        error: null,
      };
    } catch {
      return {
        data: {
          categories: [...inMemoryCategories],
          items: [...inMemoryItems],
        },
        error: null,
      };
    }
  },

  async updateItemAvailability(itemId: string, isAvailable: boolean): Promise<ServiceResponse<MenuItem>> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('menu_items')
          .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
          .eq('id', itemId)
          .select()
          .single();

        if (!error && data) {
          return {
            data: {
              id: data.id,
              restaurantId: data.restaurant_id,
              categoryId: data.category_id,
              name: data.name,
              description: data.description,
              price: Number(data.price),
              imageUrl: data.image_url,
              isVeg: data.is_veg,
              isAvailable: data.is_available,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            },
            error: null,
          };
        }
      }

      const match = inMemoryItems.find((i) => i.id === itemId);
      if (match) {
        match.isAvailable = isAvailable;
        match.updatedAt = new Date().toISOString();
        return { data: { ...match }, error: null };
      }
      return { data: null, error: 'Item not found' };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  async saveMenuItem(item: Partial<MenuItem> & { restaurantId: string; name: string; price: number; categoryId: string }): Promise<ServiceResponse<MenuItem>> {
    try {
      if (isSupabaseConfigured) {
        if (item.id) {
          // Update
          const { data, error } = await supabase
            .from('menu_items')
            .update({
              name: item.name,
              description: item.description,
              price: item.price,
              image_url: item.imageUrl,
              is_veg: item.isVeg ?? false,
              category_id: item.categoryId,
              is_available: item.isAvailable ?? true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id)
            .select()
            .single();

          if (error) return { data: null, error: error.message };
          return {
            data: {
              id: data.id,
              restaurantId: data.restaurant_id,
              categoryId: data.category_id,
              name: data.name,
              description: data.description,
              price: Number(data.price),
              imageUrl: data.image_url,
              isVeg: data.is_veg,
              isAvailable: data.is_available,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            },
            error: null,
          };
        } else {
          // Insert
          const { data, error } = await supabase
            .from('menu_items')
            .insert({
              restaurant_id: item.restaurantId,
              category_id: item.categoryId,
              name: item.name,
              description: item.description,
              price: item.price,
              image_url: item.imageUrl,
              is_veg: item.isVeg ?? false,
              is_available: item.isAvailable ?? true,
            })
            .select()
            .single();

          if (error) return { data: null, error: error.message };
          return {
            data: {
              id: data.id,
              restaurantId: data.restaurant_id,
              categoryId: data.category_id,
              name: data.name,
              description: data.description,
              price: Number(data.price),
              imageUrl: data.image_url,
              isVeg: data.is_veg,
              isAvailable: data.is_available,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            },
            error: null,
          };
        }
      }

      // Memory mode
      if (item.id) {
        const idx = inMemoryItems.findIndex((i) => i.id === item.id);
        if (idx > -1) {
          inMemoryItems[idx] = {
            ...inMemoryItems[idx],
            ...item,
            updatedAt: new Date().toISOString(),
          };
          return { data: { ...inMemoryItems[idx] }, error: null };
        }
      }

      const newItem: MenuItem = {
        id: `mock-item-${Date.now()}`,
        restaurantId: item.restaurantId,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || '',
        price: item.price,
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isVeg: item.isVeg ?? false,
        isAvailable: item.isAvailable ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryItems.unshift(newItem);
      return { data: newItem, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  async deleteMenuItem(itemId: string): Promise<ServiceResponse<boolean>> {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
        if (error) return { data: false, error: error.message };
        return { data: true, error: null };
      }

      inMemoryItems = inMemoryItems.filter((i) => i.id !== itemId);
      return { data: true, error: null };
    } catch (err: any) {
      return { data: false, error: err.message };
    }
  },

  getRestaurantSlug(): string {
    return DEMO_RESTAURANT.slug;
  },

  getRestaurantId(): string {
    return DEMO_RESTAURANT.id;
  },
};
