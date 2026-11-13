import {
  Restaurant,
  MenuCategory,
  MenuItem,
  Order,
  CreateOrderDTO,
  ServiceResponse,
} from '../../../types';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

// ============================================================================
// Demonstration Fallback Dataset (Mirrors supabase/seed.sql)
// ============================================================================

const DEMO_RESTAURANT: Restaurant = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'The Bistro Downtown',
  slug: 'the-bistro',
  description: 'Artisan neighborhood kitchen serving wood-fired specialties, fresh pasta, and craft beverages.',
  address: '142 Market Street, Suite 100, Downtown',
  phone: '+1 (555) 234-5678',
  email: 'hello@thebistrodowntown.com',
  currency: 'USD',
  isActive: true,
  createdAt: '2026-11-13T10:00:00Z',
  updatedAt: '2026-11-13T10:00:00Z',
};

const DEMO_CATEGORIES: MenuCategory[] = [
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', restaurantId: DEMO_RESTAURANT.id, name: 'Starters', displayOrder: 1, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', restaurantId: DEMO_RESTAURANT.id, name: 'Main Course', displayOrder: 2, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', restaurantId: DEMO_RESTAURANT.id, name: 'Beverages', displayOrder: 3, createdAt: '2026-11-13T10:00:00Z' },
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', restaurantId: DEMO_RESTAURANT.id, name: 'Desserts', displayOrder: 4, createdAt: '2026-11-13T10:00:00Z' },
];

const DEMO_ITEMS: MenuItem[] = [
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

let fallbackOrderSequence = 104;

// ============================================================================
// Customer Service Implementation (Conforming to docs/API_CONTRACTS.md)
// ============================================================================

export const customerService = {
  /**
   * Fetches the complete menu structure for a given restaurant slug.
   * Tries Supabase if configured, falls back to demo seed data gracefully.
   */
  async fetchMenuBySlug(slug: string): Promise<ServiceResponse<{
    restaurant: Restaurant;
    categories: MenuCategory[];
    items: MenuItem[];
  }>> {
    try {
      if (isSupabaseConfigured) {
        // Query restaurant by slug
        const { data: restaurantData, error: restError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', slug)
          .single();

        if (restError || !restaurantData) {
          // If query fails, fall back to demo data if matching slug
          if (slug === DEMO_RESTAURANT.slug || slug === 'demo') {
            return {
              data: {
                restaurant: DEMO_RESTAURANT,
                categories: DEMO_CATEGORIES,
                items: DEMO_ITEMS,
              },
              error: null,
            };
          }
          return { data: null, error: restError?.message || 'Restaurant not found' };
        }

        const restaurant: Restaurant = {
          id: restaurantData.id,
          name: restaurantData.name,
          slug: restaurantData.slug,
          description: restaurantData.description,
          address: restaurantData.address,
          phone: restaurantData.phone,
          email: restaurantData.email,
          currency: restaurantData.currency || 'USD',
          isActive: restaurantData.is_active,
          createdAt: restaurantData.created_at,
          updatedAt: restaurantData.updated_at,
        };

        // Query categories
        const { data: catData } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurant.id)
          .order('display_order', { ascending: true });

        const categories: MenuCategory[] = (catData || []).map((c: any) => ({
          id: c.id,
          restaurantId: c.restaurant_id,
          name: c.name,
          displayOrder: c.display_order,
          createdAt: c.created_at,
        }));

        // Query items
        const { data: itemsData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        const items: MenuItem[] = (itemsData || []).map((i: any) => ({
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

        return {
          data: {
            restaurant,
            categories,
            items,
          },
          error: null,
        };
      }

      // Default demo fallback when Supabase is unconfigured
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        data: {
          restaurant: DEMO_RESTAURANT,
          categories: DEMO_CATEGORIES,
          items: DEMO_ITEMS,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: {
          restaurant: DEMO_RESTAURANT,
          categories: DEMO_CATEGORIES,
          items: DEMO_ITEMS,
        },
        error: null,
      };
    }
  },

  /**
   * Dispatches a new customer order.
   * If Supabase is configured, executes the server-side `create_customer_order` RPC.
   * Otherwise, provides an authentic transactional fallback confirmation.
   */
  async createOrder(payload: CreateOrderDTO): Promise<ServiceResponse<Order>> {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.rpc('create_customer_order', {
          p_restaurant_id: payload.restaurantId,
          p_order_type: payload.orderType,
          p_customer_name: payload.customerName,
          p_table_number: payload.tableNumber || null,
          p_customer_phone: payload.customerPhone || null,
          p_notes: payload.notes || null,
          p_items: payload.items.map((it) => ({
            itemId: it.itemId,
            quantity: it.quantity,
            instructions: it.instructions || null,
          })),
        });

        if (error) {
          return { data: null, error: error.message };
        }

        const confirmedOrder: Order = {
          id: data.orderId,
          restaurantId: payload.restaurantId,
          orderNumber: data.orderNumber,
          orderType: payload.orderType,
          tableNumber: payload.tableNumber,
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          items: payload.items,
          subtotal: Number(data.subtotal || data.totalAmount),
          taxAmount: 0,
          totalAmount: Number(data.totalAmount),
          status: 'pending',
          notes: payload.notes,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return { data: confirmedOrder, error: null };
      }

      // Authentic offline / demo simulation
      await new Promise((resolve) => setTimeout(resolve, 600));
      fallbackOrderSequence += 1;
      const orderNumber = `#${fallbackOrderSequence}`;
      const subtotal = payload.items.reduce((s, it) => s + it.price * it.quantity, 0);

      const confirmedOrder: Order = {
        id: `mock-ord-${Date.now()}`,
        restaurantId: payload.restaurantId,
        orderNumber,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        items: payload.items,
        subtotal,
        taxAmount: 0,
        totalAmount: subtotal,
        status: 'pending',
        notes: payload.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { data: confirmedOrder, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to place order' };
    }
  },
};
