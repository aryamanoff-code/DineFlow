import { Order, OrderStatus, CreateOrderDTO, ServiceResponse } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DEMO_RESTAURANT } from './restaurantService';
import { menuService } from './menuService';

// Default mock orders matching supabase/seed.sql
export const DEMO_ORDERS: Order[] = [
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
];

let liveOrdersStore: Order[] = [...DEMO_ORDERS];
let simulatedSequence = 104;

type OrderListener = {
  restaurantId: string;
  onInsert: (order: Order) => void;
  onUpdate: (order: Order) => void;
};
const localListeners = new Set<OrderListener>();

const mapOrderRow = (row: any): Order => ({
  id: row.id,
  restaurantId: row.restaurant_id,
  orderNumber: row.order_number,
  orderType: row.order_type,
  tableNumber: row.table_number || null,
  customerName: row.customer_name,
  customerPhone: row.customer_phone || null,
  items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
  subtotal: Number(row.subtotal || row.total_amount),
  taxAmount: Number(row.tax_amount || 0),
  totalAmount: Number(row.total_amount),
  status: row.status,
  notes: row.notes || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const orderService = {
  /**
   * Submits a customer order.
   * Performs client validation then dispatches to the secure server-side RPC `create_customer_order`.
   * Enforces database-side price calculation and 86'd stock availability checks.
   */
  async createOrder(payload: CreateOrderDTO): Promise<ServiceResponse<Order>> {
    // 1. Client-Side Input Validation
    if (!payload.restaurantId) {
      return { data: null, error: 'Restaurant ID is required' };
    }
    if (!payload.customerName || !payload.customerName.trim()) {
      return { data: null, error: 'Customer name is required' };
    }
    if (payload.orderType === 'dine_in' && (!payload.tableNumber || !payload.tableNumber.trim())) {
      return { data: null, error: 'Table number is required for dine-in orders' };
    }
    if (!payload.items || payload.items.length === 0) {
      return { data: null, error: 'Order must contain at least one item' };
    }

    try {
      // 2. Validate Dish Availability
      const menuRes = await menuService.getMenu(payload.restaurantId);
      if (menuRes.data?.items) {
        for (const item of payload.items) {
          const found = menuRes.data.items.find((i) => i.id === item.itemId);
          if (found && !found.isAvailable) {
            return {
              data: null,
              error: `Menu item "${found.name}" is currently sold out and unavailable`,
            };
          }
        }
      }

      if (isSupabaseConfigured) {
        // Execute server-side RPC for price calculation & atomicity
        const { data, error } = await supabase.rpc('create_customer_order', {
          p_restaurant_id: payload.restaurantId,
          p_order_type: payload.orderType,
          p_customer_name: payload.customerName.trim(),
          p_table_number: payload.tableNumber ? payload.tableNumber.trim() : null,
          p_customer_phone: payload.customerPhone ? payload.customerPhone.trim() : null,
          p_notes: payload.notes ? payload.notes.trim() : null,
          p_items: payload.items.map((it) => ({
            itemId: it.itemId,
            quantity: it.quantity,
            instructions: it.instructions || null,
          })),
        });

        if (error) {
          // Translate DB errors into friendly user messages
          return { data: null, error: error.message };
        }

        const confirmedOrder: Order = {
          id: data.orderId,
          restaurantId: payload.restaurantId,
          orderNumber: data.orderNumber,
          orderType: payload.orderType,
          tableNumber: payload.tableNumber || null,
          customerName: payload.customerName.trim(),
          customerPhone: payload.customerPhone || null,
          items: payload.items,
          subtotal: Number(data.subtotal || data.totalAmount),
          taxAmount: 0,
          totalAmount: Number(data.totalAmount),
          status: 'pending',
          notes: payload.notes || null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Cache into live order store
        liveOrdersStore = [confirmedOrder, ...liveOrdersStore];

        // Notify local subscribers
        localListeners.forEach((listener) => {
          if (listener.restaurantId === payload.restaurantId) {
            try {
              listener.onInsert(confirmedOrder);
            } catch (err) {
              console.warn('[orderService] Listener error on insert:', err);
            }
          }
        });

        return { data: confirmedOrder, error: null };
      }

      // Offline / Unconfigured fallback
      await new Promise((r) => setTimeout(r, 400));
      simulatedSequence += 1;
      const orderNumber = `#${simulatedSequence}`;
      const subtotal = payload.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

      const confirmedOrder: Order = {
        id: `ord-offline-${Date.now()}`,
        restaurantId: payload.restaurantId,
        orderNumber,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber || null,
        customerName: payload.customerName.trim(),
        customerPhone: payload.customerPhone || null,
        items: payload.items,
        subtotal,
        taxAmount: 0,
        totalAmount: subtotal,
        status: 'pending',
        notes: payload.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      liveOrdersStore = [confirmedOrder, ...liveOrdersStore];

      // Notify local subscribers
      localListeners.forEach((listener) => {
        if (listener.restaurantId === payload.restaurantId) {
          try {
            listener.onInsert(confirmedOrder);
          } catch (err) {
            console.warn('[orderService] Listener error on insert:', err);
          }
        }
      });

      return { data: confirmedOrder, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to submit order' };
    }
  },

  /**
   * Retrieves active orders for a restaurant.
   * Enforces RLS: Requires authenticated restaurant staff.
   */
  async getOrders(restaurantId: string): Promise<ServiceResponse<Order[]>> {
    if (!restaurantId) return { data: null, error: 'Restaurant ID is required' };

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[orderService.getOrders] Supabase error:', error.message);
        } else if (data) {
          const mapped = data.map(mapOrderRow);
          liveOrdersStore = mapped;
          return { data: mapped, error: null };
        }
      }

      return { data: [...liveOrdersStore], error: null };
    } catch {
      return { data: [...liveOrdersStore], error: null };
    }
  },

  /**
   * Retrieves single order by UUID.
   */
  async getOrderById(orderId: string): Promise<ServiceResponse<Order>> {
    if (!orderId) return { data: null, error: 'Order ID is required' };

    try {
      if (isSupabaseConfigured) {
        // Query via secure RPC or table
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_customer_order', {
          p_order_id: orderId,
        });

        if (!rpcError && rpcData && rpcData.success) {
          const o: Order = {
            id: rpcData.orderId,
            restaurantId: rpcData.restaurantId,
            orderNumber: rpcData.orderNumber,
            orderType: rpcData.orderType,
            tableNumber: rpcData.tableNumber,
            customerName: rpcData.customerName,
            items: rpcData.items,
            subtotal: Number(rpcData.subtotal),
            taxAmount: 0,
            totalAmount: Number(rpcData.totalAmount),
            status: rpcData.status,
            notes: rpcData.notes,
            createdAt: rpcData.createdAt,
            updatedAt: rpcData.updatedAt,
          };
          return { data: o, error: null };
        }
      }

      const match = liveOrdersStore.find((o) => o.id === orderId);
      if (match) return { data: { ...match }, error: null };

      return { data: null, error: 'Order not found' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Unable to retrieve order' };
    }
  },

  /**
   * Transitions an order's lifecycle status (pending -> preparing -> ready -> completed / cancelled).
   * Enforces RLS: Requires authenticated restaurant staff.
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ServiceResponse<Order>> {
    if (!orderId) return { data: null, error: 'Order ID is required' };

    const validStatuses: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return { data: null, error: `Invalid order status: "${status}"` };
    }

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .select()
          .single();

        if (error) {
          return { data: null, error: error.message };
        }
        const updated = mapOrderRow(data);
        liveOrdersStore = liveOrdersStore.map((o) => (o.id === orderId ? updated : o));

        // Notify local subscribers
        localListeners.forEach((listener) => {
          if (listener.restaurantId === updated.restaurantId) {
            try {
              listener.onUpdate(updated);
            } catch (err) {
              console.warn('[orderService] Listener error on update:', err);
            }
          }
        });

        return { data: updated, error: null };
      }

      // Memory update
      const match = liveOrdersStore.find((o) => o.id === orderId);
      if (match) {
        match.status = status;
        match.updatedAt = new Date().toISOString();

        // Notify local subscribers
        localListeners.forEach((listener) => {
          if (listener.restaurantId === match.restaurantId) {
            try {
              listener.onUpdate({ ...match });
            } catch (err) {
              console.warn('[orderService] Listener error on update:', err);
            }
          }
        });

        return { data: { ...match }, error: null };
      }
      return { data: null, error: 'Order not found' };
    } catch (err: any) {
      return { data: null, error: err.message || 'Unable to update status' };
    }
  },

  /**
   * Subscribes to Realtime events on the public.orders table for a restaurant.
   * Returns an unsubscribe cleanup function.
   */
  subscribeToOrders(
    restaurantId: string,
    onInsert: (order: Order) => void,
    onUpdate: (order: Order) => void
  ): () => void {
    const listener: OrderListener = { restaurantId, onInsert, onUpdate };
    localListeners.add(listener);

    let supabaseUnsubscribe = () => {};

    if (isSupabaseConfigured) {
      const channelName = `realtime:orders:${restaurantId}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
          (payload) => {
            const mapped = mapOrderRow(payload.new);
            onInsert(mapped);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
          (payload) => {
            const mapped = mapOrderRow(payload.new);
            onUpdate(mapped);
          }
        )
        .subscribe();

      supabaseUnsubscribe = () => {
        supabase.removeChannel(channel);
      };
    }

    return () => {
      localListeners.delete(listener);
      supabaseUnsubscribe();
    };
  },
};
