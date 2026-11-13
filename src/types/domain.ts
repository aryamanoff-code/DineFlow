export type OrderType = "dine_in" | "takeaway";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  isAvailable: boolean;
  isVegetarian: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItemSnapshot {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  restaurantId: string;
  orderType: OrderType;
  tableNumber?: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  items: OrderItemSnapshot[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}