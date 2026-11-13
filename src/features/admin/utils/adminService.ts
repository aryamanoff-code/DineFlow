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
import { authService } from '../../../services/authService';
import { orderService } from '../../../services/orderService';
import { menuService } from '../../../services/menuService';
import { restaurantService, DEMO_RESTAURANT } from '../../../services/restaurantService';

const STAFF_STORAGE_KEY = 'dineflow_staff_session';

// ============================================================================
// Restaurant Administration Service Layer (Conforming to docs/API_CONTRACTS.md)
// Encapsulates Staff Auth, Live KDS Streams, Menu Governance, and QR Utilities
// ============================================================================

export const adminService = {
  getRestaurantId(): string {
    return DEMO_RESTAURANT.id;
  },

  getRestaurantSlug(): string {
    return DEMO_RESTAURANT.slug;
  },

  // --------------------------------------------------------------------------
  // 1. Staff Authentication
  // --------------------------------------------------------------------------
  async signIn(credentials: SignInCredentials): Promise<ServiceResponse<StaffSession>> {
    return authService.signIn(credentials);
  },

  async signOut(): Promise<ServiceResponse<void>> {
    return authService.signOut();
  },

  getCurrentSession(): StaffSession | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(STAFF_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  async getCurrentSessionAsync(): Promise<ServiceResponse<StaffSession | null>> {
    return authService.getCurrentSession();
  },

  // --------------------------------------------------------------------------
  // 2. Live Order Management & KDS
  // --------------------------------------------------------------------------
  async fetchLiveOrders(restaurantId: string = DEMO_RESTAURANT.id): Promise<ServiceResponse<Order[]>> {
    return orderService.getOrders(restaurantId);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ServiceResponse<Order>> {
    return orderService.updateOrderStatus(orderId, status);
  },

  subscribeToLiveOrders(
    restaurantId: string = DEMO_RESTAURANT.id,
    onInsert: (order: Order) => void,
    onUpdate: (order: Order) => void
  ): () => void {
    return orderService.subscribeToOrders(restaurantId, onInsert, onUpdate);
  },

  // --------------------------------------------------------------------------
  // 3. Menu Governance & Availability
  // --------------------------------------------------------------------------
  async fetchMenu(restaurantId: string = DEMO_RESTAURANT.id): Promise<
    ServiceResponse<{ categories: MenuCategory[]; items: MenuItem[] }>
  > {
    return menuService.getMenu(restaurantId);
  },

  async updateItemAvailability(itemId: string, isAvailable: boolean): Promise<ServiceResponse<MenuItem>> {
    return menuService.setMenuItemAvailability(itemId, isAvailable);
  },

  async saveMenuItem(
    payload: Partial<MenuItem> & { restaurantId: string; name: string; price: number; categoryId: string }
  ): Promise<ServiceResponse<MenuItem>> {
    return menuService.saveMenuItem(payload);
  },

  async deleteMenuItem(itemId: string): Promise<ServiceResponse<boolean>> {
    return menuService.deleteMenuItem(itemId);
  },

  async fetchRestaurantDetails(restaurantId: string = DEMO_RESTAURANT.id): Promise<ServiceResponse<Restaurant>> {
    return restaurantService.getRestaurantById(restaurantId);
  },
};
