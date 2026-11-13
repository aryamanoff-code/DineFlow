-- ==============================================================================
-- DineFlow - Initial Schema Migration
-- ==============================================================================
-- Migration: 20261113000000_initial_schema.sql
-- Description: Core relational schema, Row Level Security (RLS) policies,
--              transactional order creation RPC, and Realtime publications.
-- ==============================================================================

-- 0. Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Helper Functions & Triggers
-- ==============================================================================

-- Trigger function to auto-update 'updated_at' column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. Core Tables
-- ==============================================================================

-- 2.1. Restaurants
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  currency TEXT DEFAULT 'USD' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT chk_restaurant_slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE TRIGGER trg_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2.2. Menu Categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT uq_restaurant_category_name UNIQUE(restaurant_id, name)
);

-- 2.3. Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_veg BOOLEAN DEFAULT false NOT NULL,
  is_available BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2.4. Restaurant Staff (Mapping Supabase Auth users to restaurants)
CREATE TABLE IF NOT EXISTS public.restaurant_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT uq_restaurant_staff_membership UNIQUE (restaurant_id, user_id)
);

-- 2.5. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeaway')),
  table_number TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT chk_dine_in_table CHECK (order_type != 'dine_in' OR (table_number IS NOT NULL AND trim(table_number) <> ''))
);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. Performance Indexes
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON public.restaurants(is_active);

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_order ON public.menu_categories(restaurant_id, display_order);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON public.menu_items(restaurant_id, is_available);

CREATE INDEX IF NOT EXISTS idx_restaurant_staff_user ON public.restaurant_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_staff_restaurant ON public.restaurant_staff(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON public.orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created_at ON public.orders(restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_number ON public.orders(restaurant_id, order_number);

-- ==============================================================================
-- 4. Row Level Security (RLS) Helper Functions & Policies
-- ==============================================================================

-- Security definer function to verify if the authenticated user is staff of a restaurant.
-- Using SECURITY DEFINER and search_path prevents policy recursion and grants minimal overhead.
CREATE OR REPLACE FUNCTION public.is_restaurant_staff(p_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurant_staff
    WHERE restaurant_id = p_restaurant_id
      AND user_id = auth.uid()
  );
$$;

-- Security definer function to check if the authenticated user is an admin of a restaurant.
CREATE OR REPLACE FUNCTION public.is_restaurant_admin(p_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurant_staff
    WHERE restaurant_id = p_restaurant_id
      AND user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Enable Row Level Security on all tables
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4.1. Restaurants Policies
-- Public can read active restaurants; staff can read their own restaurant even if inactive
CREATE POLICY "Public can view active restaurants"
ON public.restaurants
FOR SELECT
TO public
USING (is_active = true OR public.is_restaurant_staff(id));

-- Only authorized admin staff can update restaurant configuration
CREATE POLICY "Admin staff can update their restaurant"
ON public.restaurants
FOR UPDATE
TO authenticated
USING (public.is_restaurant_admin(id))
WITH CHECK (public.is_restaurant_admin(id));

-- 4.2. Menu Categories Policies
-- Public can view categories of active restaurants
CREATE POLICY "Public can view categories of active restaurants"
ON public.menu_categories
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = menu_categories.restaurant_id
      AND (r.is_active = true OR public.is_restaurant_staff(r.id))
  )
);

-- Staff can insert categories for their restaurant
CREATE POLICY "Staff can insert categories"
ON public.menu_categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- Staff can update categories for their restaurant
CREATE POLICY "Staff can update categories"
ON public.menu_categories
FOR UPDATE
TO authenticated
USING (public.is_restaurant_staff(restaurant_id))
WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- Staff can delete categories for their restaurant
CREATE POLICY "Staff can delete categories"
ON public.menu_categories
FOR DELETE
TO authenticated
USING (public.is_restaurant_staff(restaurant_id));

-- 4.3. Menu Items Policies
-- Public can view menu items of active restaurants
CREATE POLICY "Public can view menu items of active restaurants"
ON public.menu_items
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.id = menu_items.restaurant_id
      AND (r.is_active = true OR public.is_restaurant_staff(r.id))
  )
);

-- Staff can insert menu items for their restaurant
CREATE POLICY "Staff can insert menu items"
ON public.menu_items
FOR INSERT
TO authenticated
WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- Staff can update menu items (prices, stock availability, details)
CREATE POLICY "Staff can update menu items"
ON public.menu_items
FOR UPDATE
TO authenticated
USING (public.is_restaurant_staff(restaurant_id))
WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- Staff can delete menu items
CREATE POLICY "Staff can delete menu items"
ON public.menu_items
FOR DELETE
TO authenticated
USING (public.is_restaurant_staff(restaurant_id));

-- 4.4. Restaurant Staff Policies
-- Staff can view other staff memberships within their restaurant; anonymous users are BLOCKED
CREATE POLICY "Staff can view members of their restaurant"
ON public.restaurant_staff
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR public.is_restaurant_staff(restaurant_id)
);

-- Only restaurant admins can manage staff memberships
CREATE POLICY "Admins can insert staff members"
ON public.restaurant_staff
FOR INSERT
TO authenticated
WITH CHECK (public.is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can update staff members"
ON public.restaurant_staff
FOR UPDATE
TO authenticated
USING (public.is_restaurant_admin(restaurant_id))
WITH CHECK (public.is_restaurant_admin(restaurant_id));

CREATE POLICY "Admins can delete staff members"
ON public.restaurant_staff
FOR DELETE
TO authenticated
USING (public.is_restaurant_admin(restaurant_id));

-- 4.5. Orders Policies
-- Staff can view all active and historical orders for their restaurant
CREATE POLICY "Staff can view orders for their restaurant"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_restaurant_staff(restaurant_id));

-- Staff can update order status (e.g. pending -> preparing -> ready -> completed)
CREATE POLICY "Staff can update orders for their restaurant"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_restaurant_staff(restaurant_id))
WITH CHECK (public.is_restaurant_staff(restaurant_id));

-- Direct unrestricted public inserts/reads on orders are intentionally NOT permitted via table policies.
-- Order creation is encapsulated via the secure transactional function `create_customer_order`.

-- ==============================================================================
-- 5. Secure Transactional Order Creation RPC
-- ==============================================================================

/**
 * create_customer_order
 *
 * Secure server-side function to validate, calculate, and persist customer orders.
 *
 * Security guarantees:
 * - Validates restaurant existence and active status.
 * - Enforces required table number for dine-in orders.
 * - Validates that every requested item belongs to the restaurant.
 * - Validates that each item is currently in-stock (is_available = true).
 * - Recalculates all line prices and total amount using database price values.
 * - Stores immutable JSON snapshots with verified item details.
 * - Generates human-readable sequential order numbers (#101, #102, ...).
 * - Executes transactionally.
 */
CREATE OR REPLACE FUNCTION public.create_customer_order(
  p_restaurant_id UUID,
  p_order_type TEXT,
  p_customer_name TEXT,
  p_items JSONB,
  p_table_number TEXT DEFAULT NULL,
  p_customer_phone TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_restaurant RECORD;
  v_item_element JSONB;
  v_item_id UUID;
  v_qty INT;
  v_instructions TEXT;
  v_menu_item RECORD;
  v_item_total NUMERIC(10,2);
  v_subtotal NUMERIC(10,2) := 0.00;
  v_total NUMERIC(10,2) := 0.00;
  v_snapshot_items JSONB := '[]'::JSONB;
  v_order_count INT;
  v_order_number TEXT;
  v_new_order_id UUID;
  v_clean_table TEXT;
BEGIN
  -- 1. Validate Restaurant
  SELECT id, name, currency, is_active
  INTO v_restaurant
  FROM public.restaurants
  WHERE id = p_restaurant_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found with id %', p_restaurant_id;
  END IF;

  IF NOT v_restaurant.is_active THEN
    RAISE EXCEPTION 'Restaurant "%" is currently closed or inactive', v_restaurant.name;
  END IF;

  -- 2. Validate Order Type & Table Number
  IF p_order_type NOT IN ('dine_in', 'takeaway') THEN
    RAISE EXCEPTION 'Invalid order type: %. Must be "dine_in" or "takeaway"', p_order_type;
  END IF;

  v_clean_table := NULLIF(trim(p_table_number), '');
  IF p_order_type = 'dine_in' AND v_clean_table IS NULL THEN
    RAISE EXCEPTION 'A valid table number is required for dine-in orders';
  END IF;

  -- 3. Validate Customer Name
  IF trim(COALESCE(p_customer_name, '')) = '' THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;

  -- 4. Validate Items Payload
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- 5. Validate Each Item & Calculate Verified Database Prices
  FOR v_item_element IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Extract and validate item ID
    BEGIN
      v_item_id := (v_item_element->>'itemId')::UUID;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid UUID format for item ID: %', v_item_element->>'itemId';
    END;

    -- Extract and validate quantity
    v_qty := COALESCE((v_item_element->>'quantity')::INT, 0);
    IF v_qty <= 0 OR v_qty > 50 THEN
      RAISE EXCEPTION 'Invalid quantity (%) for item %. Must be between 1 and 50', v_qty, v_item_id;
    END IF;

    v_instructions := NULLIF(trim(v_item_element->>'instructions'), '');

    -- Query current database record with FOR SHARE to lock against concurrent edits
    SELECT id, restaurant_id, name, price, is_available
    INTO v_menu_item
    FROM public.menu_items
    WHERE id = v_item_id
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Menu item % does not exist', v_item_id;
    END IF;

    IF v_menu_item.restaurant_id <> p_restaurant_id THEN
      RAISE EXCEPTION 'Menu item "%" does not belong to restaurant %', v_menu_item.name, p_restaurant_id;
    END IF;

    IF NOT v_menu_item.is_available THEN
      RAISE EXCEPTION 'Menu item "%" is currently sold out and unavailable', v_menu_item.name;
    END IF;

    -- Calculate using authoritative database price
    v_item_total := v_menu_item.price * v_qty;
    v_subtotal := v_subtotal + v_item_total;

    -- Append verified snapshot
    v_snapshot_items := v_snapshot_items || jsonb_build_object(
      'itemId', v_menu_item.id,
      'name', v_menu_item.name,
      'price', v_menu_item.price,
      'quantity', v_qty,
      'instructions', v_instructions,
      'itemTotal', v_item_total
    );
  END LOOP;

  v_total := v_subtotal; -- Expandable with restaurant tax / surcharge rules

  -- 6. Generate Human-Readable Order Number
  SELECT count(*) + 1 INTO v_order_count
  FROM public.orders
  WHERE restaurant_id = p_restaurant_id;

  v_order_number := '#' || (100 + v_order_count)::TEXT;

  -- 7. Insert Order Record Transactionally
  INSERT INTO public.orders (
    restaurant_id,
    order_number,
    order_type,
    table_number,
    customer_name,
    customer_phone,
    items,
    subtotal,
    tax_amount,
    total_amount,
    status,
    notes
  ) VALUES (
    p_restaurant_id,
    v_order_number,
    p_order_type,
    v_clean_table,
    trim(p_customer_name),
    NULLIF(trim(p_customer_phone), ''),
    v_snapshot_items,
    v_subtotal,
    0.00,
    v_total,
    'pending',
    NULLIF(trim(p_notes), '')
  )
  RETURNING id INTO v_new_order_id;

  -- 8. Return Verified Confirmation Payload
  RETURN jsonb_build_object(
    'success', true,
    'orderId', v_new_order_id,
    'orderNumber', v_order_number,
    'orderType', p_order_type,
    'tableNumber', v_clean_table,
    'customerName', trim(p_customer_name),
    'items', v_snapshot_items,
    'subtotal', v_subtotal,
    'totalAmount', v_total,
    'currency', v_restaurant.currency,
    'status', 'pending',
    'createdAt', now()
  );
END;
$$;

-- Grant execution rights on order creation to anonymous diners and authenticated users
GRANT EXECUTE ON FUNCTION public.create_customer_order(UUID, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT) TO anon, authenticated;

-- ==============================================================================
-- 6. Customer Order Tracking Function
-- ==============================================================================

/**
 * get_customer_order
 *
 * Secure function enabling customers to retrieve their specific order status
 * using the unique order ID without exposing the entire orders table.
 */
CREATE OR REPLACE FUNCTION public.get_customer_order(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_currency TEXT;
BEGIN
  SELECT o.*, r.currency
  INTO v_order
  FROM public.orders o
  JOIN public.restaurants r ON r.id = o.restaurant_id
  WHERE o.id = p_order_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'orderId', v_order.id,
    'restaurantId', v_order.restaurant_id,
    'orderNumber', v_order.order_number,
    'orderType', v_order.order_type,
    'tableNumber', v_order.table_number,
    'customerName', v_order.customer_name,
    'items', v_order.items,
    'subtotal', v_order.subtotal,
    'totalAmount', v_order.total_amount,
    'currency', v_order.currency,
    'status', v_order.status,
    'notes', v_order.notes,
    'createdAt', v_order.created_at,
    'updatedAt', v_order.updated_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_customer_order(UUID) TO anon, authenticated;

-- ==============================================================================
-- 7. Realtime Configuration
-- ==============================================================================

-- Enable full row reproduction for updates on the orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add orders table to Supabase Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
