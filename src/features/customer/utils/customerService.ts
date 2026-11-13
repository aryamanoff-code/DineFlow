import {
  Restaurant,
  MenuCategory,
  MenuItem,
  Order,
  CreateOrderDTO,
  ServiceResponse,
} from '../../../types';
import { restaurantService } from '../../../services/restaurantService';
import { menuService } from '../../../services/menuService';
import { orderService } from '../../../services/orderService';

// ============================================================================
// Customer Service Implementation (Conforming to docs/API_CONTRACTS.md)
// Encapsulates menu discovery and transactional customer order submission
// ============================================================================

export const customerService = {
  /**
   * Fetches the complete menu structure for a given restaurant slug.
   * Leverages unified restaurantService and menuService.
   */
  async fetchMenuBySlug(slug: string): Promise<ServiceResponse<{
    restaurant: Restaurant;
    categories: MenuCategory[];
    items: MenuItem[];
  }>> {
    const restRes = await restaurantService.getRestaurantBySlug(slug);
    if (restRes.error || !restRes.data) {
      return { data: null, error: restRes.error || 'Restaurant not found' };
    }

    const menuRes = await menuService.getMenu(restRes.data.id);
    if (menuRes.error || !menuRes.data) {
      return { data: null, error: menuRes.error || 'Failed to load restaurant menu' };
    }

    return {
      data: {
        restaurant: restRes.data,
        categories: menuRes.data.categories,
        items: menuRes.data.items,
      },
      error: null,
    };
  },

  /**
   * Retrieves restaurant metadata by its UUID.
   */
  async fetchRestaurantById(id: string): Promise<ServiceResponse<Restaurant>> {
    return restaurantService.getRestaurantById(id);
  },

  /**
   * Dispatches a new customer order.
   * Delegates to authoritative orderService with DB/in-memory price calculation & 86'd stock checks.
   */
  async createOrder(payload: CreateOrderDTO): Promise<ServiceResponse<Order>> {
    return orderService.createOrder(payload);
  },

  /**
   * Retrieves order status and item snapshots by UUID.
   */
  async fetchOrderById(orderId: string): Promise<ServiceResponse<Order>> {
    return orderService.getOrderById(orderId);
  },
};
