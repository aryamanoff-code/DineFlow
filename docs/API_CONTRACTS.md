# API Contracts & Service Signatures: DineFlow

This document formalizes the TypeScript domain entities, DTOs (Data Transfer Objects), and service function signatures used by both the Customer Application and Restaurant Admin Dashboard.

> **Note**: Implementation is intentionally deferred. This contract serves as the strict blueprint for the implementation phase.

---

## 1. Shared Domain Models & Types

```typescript
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
  address?: string;
  phone?: string;
  currency: string;
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
  orderType: OrderType;
  tableNumber?: string | null;
  customerName: string;
  customerPhone?: string | null;
  items: OrderCartItem[];
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
```

---

## 2. Data Transfer Objects (DTOs)

```typescript
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
```

---

## 3. Service Layer Contracts

### 3.1. Menu Service (`src/services/menuService.ts`)

```typescript
export interface IMenuService {
  /**
   * Fetches the complete menu structure (categories + items) for a given restaurant.
   * Used by: Customer Menu Browse, Admin Menu Editor.
   */
  fetchRestaurantMenu(restaurantId: string): Promise<
    ServiceResponse<{
      restaurant: Restaurant;
      categories: MenuCategory[];
      items: MenuItem[];
    }>
  >;

  /**
   * Toggles item availability (86'd status) in real time.
   * Used by: Admin Menu Editor.
   */
  updateItemAvailability(
    itemId: string,
    isAvailable: boolean
  ): Promise<ServiceResponse<MenuItem>>;

  /**
   * Updates price for a specific menu item.
   * Used by: Admin Menu Editor.
   */
  updateItemPrice(
    itemId: string,
    newPrice: number
  ): Promise<ServiceResponse<MenuItem>>;

  /**
   * Creates a new menu item under an existing category.
   * Used by: Admin Menu Editor.
   */
  createMenuItem(payload: CreateMenuItemDTO): Promise<ServiceResponse<MenuItem>>;
}
```

---

### 3.2. Order Service (`src/services/orderService.ts`)

```typescript
export interface IOrderService {
  /**
   * Submits a customer order to Supabase.
   * Used by: Customer Checkout.
   */
  createOrder(payload: CreateOrderDTO): Promise<ServiceResponse<Order>>;

  /**
   * Fetches single order details by ID for receipt tracking.
   * Used by: Customer Order Receipt Page.
   */
  getOrderById(orderId: string): Promise<ServiceResponse<Order>>;

  /**
   * Fetches all active orders (pending, preparing, ready) for the KDS.
   * Used by: Admin Live Orders Page.
   */
  getActiveOrders(restaurantId: string): Promise<ServiceResponse<Order[]>>;

  /**
   * Transitions order state (e.g. pending -> preparing -> ready).
   * Used by: Admin Live Orders Page.
   */
  updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<ServiceResponse<Order>>;

  /**
   * Establishes a Supabase Realtime channel subscription listening to
   * INSERT and UPDATE events on the orders table.
   * Returns an unsubscribe teardown function.
   * Used by: Admin Live Orders Hook (useLiveOrders).
   */
  subscribeToLiveOrders(
    restaurantId: string,
    onInsert: (newOrder: Order) => void,
    onUpdate: (updatedOrder: Order) => void
  ): () => void;
}
```

---

### 3.3. Authentication Service (`src/services/authService.ts`)

```typescript
export interface IAuthService {
  /**
   * Signs in staff user via Supabase Auth and loads their restaurant profile.
   * Used by: Admin Login Page.
   */
  signInStaff(credentials: SignInCredentials): Promise<ServiceResponse<StaffSession>>;

  /**
   * Terminates active staff session.
   * Used by: Admin Dashboard Header.
   */
  signOutStaff(): Promise<ServiceResponse<void>>;

  /**
   * Restores active staff session from cached JWT token on application mount.
   * Used by: Admin Auth Provider / Route Guard.
   */
  getCurrentSession(): Promise<ServiceResponse<StaffSession | null>>;
}
```

---

## 4. Contract Conformance Rules

1. **No Direct Supabase Calls**: UI views must strictly consume methods adhering to `IMenuService`, `IOrderService`, or `IAuthService`.
2. **Error Isolation**: All thrown database or network exceptions must be caught inside service implementations and wrapped into `{ data: null, error: error.message }`. UI components must never deal with raw PostgREST exceptions.
3. **Immutability**: DTOs and models returned must be treated as immutable by UI consumers.
