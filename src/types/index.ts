/**
 * DineFlow Canonical Domain Models & DTOs
 * Strictly typed definitions for customer and administrative domains.
 */

// ============================================================================
// Core Identifiers & Enumerations
// ============================================================================

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine_in' | 'takeaway';
export type StaffRole = 'admin' | 'manager' | 'staff';

// ============================================================================
// Normalized Service Response
// ============================================================================

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// ============================================================================
// Domain Entities
// ============================================================================

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  instructions?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string | null;
  customerName: string;
  customerPhone?: string | null;
  items: OrderCartItem[];
  subtotal: number;
  taxAmount?: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  restaurantId: string;
  fullName: string;
  role: StaffRole;
  createdAt: string;
}

export interface StaffSession {
  profile: StaffProfile;
  token: string;
}

// ============================================================================
// Data Transfer Objects (DTOs)
// ============================================================================

export interface CreateOrderDTO {
  restaurantId: string;
  orderType: OrderType;
  tableNumber?: string | null;
  customerName: string;
  customerPhone?: string | null;
  items: OrderCartItem[];
  totalAmount: number;
  notes?: string;
}

export interface CreateMenuItemDTO {
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
}

export interface UpdateMenuItemDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
