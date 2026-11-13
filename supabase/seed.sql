-- ==============================================================================
-- DineFlow - Demonstration & Development Seed Dataset
-- ==============================================================================
-- File: supabase/seed.sql
-- Description: Populates a demonstration restaurant, categorized menu catalog,
--              representative items (including 86'd stock states), sample orders,
--              and a staff linking helper procedure.
-- ==============================================================================

-- 1. Create Demo Restaurant ("The Bistro Downtown")
INSERT INTO public.restaurants (
  id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  currency,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'The Bistro Downtown',
  'the-bistro',
  'Artisan neighborhood kitchen serving wood-fired specialties, fresh pasta, and craft beverages.',
  '142 Market Street, Suite 100, Downtown',
  '+1 (555) 234-5678',
  'manager@bistro.com',
  'USD',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  is_active = EXCLUDED.is_active;

-- 2. Create Menu Categories
INSERT INTO public.menu_categories (id, restaurant_id, name, display_order)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Starters', 1),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Main Course', 2),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Beverages', 3),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Desserts', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order;

-- 3. Create Menu Items (with rich photos, dietary tags, and stock availability)
INSERT INTO public.menu_items (
  id,
  restaurant_id,
  category_id,
  name,
  description,
  price,
  image_url,
  is_veg,
  is_available
) VALUES
  -- Starters
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'Crispy Rosemary Bruschetta',
    'Charred artisan sourdough baguette topped with heirloom cherry tomatoes, fresh basil, garlic-infused olive oil, and balsamic glaze.',
    9.50,
    'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'Truffle Parmesan Hand-Cut Fries',
    'Crispy Idaho potatoes tossed in white truffle oil, grated 24-month Parmigiano-Reggiano, and chopped wild chives.',
    8.00,
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c03',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'Crispy Calamari Fritti',
    'Tender Monterey squid lightly crusted, tossed with fried cherry peppers, served with charred lemon aioli.',
    12.50,
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    false,
    true
  ),

  -- Main Course
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'Classic Truffle Burger',
    'Half-pound aged Prime Angus beef patty, shaved black summer truffles, aged Gruyere cheese, caramelized onions on toasted brioche.',
    16.50,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    false,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'Wild Forest Mushroom Risotto',
    'Creamy Carnaroli rice slowly cooked in vegetable herb broth with porcini mushrooms, baby leeks, and Pecorino Romano.',
    14.00,
    'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c06',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'Wood-Fired Margherita Pizza',
    'San Marzano tomato sauce, hand-pulled fresh buffalo mozzarella, fresh basil, and extra virgin olive oil on slow-fermented crust.',
    13.50,
    'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c07',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'Braised Angus Short Rib',
    '12-hour red wine braised beef short rib served over creamy polenta with glazed baby carrots and natural jus.',
    24.00,
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    false,
    true
  ),

  -- Beverages
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c08',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    'House Brewed Citrus Iced Tea',
    'Slow-steeped Earl Grey tea infused with fresh orange zest, Meyer lemon slices, and organic cane sugar.',
    4.50,
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c09',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    'Cold-Pressed Ginger Lemonade',
    'Fresh pressed ginger root, Sicilian lemons, filtered sparkling spring water, lightly sweetened with agave.',
    5.00,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b03',
    'Nitro Cold Brew Coffee',
    'Single-origin Ethiopian Yirgacheffe cold brew infused with nitrogen for a velvety, creamy cascade.',
    5.50,
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    true,
    false -- Marked 86'd (Sold Out) for live availability toggle demonstration
  ),

  -- Desserts
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    'Warm Belgian Chocolate Lava Cake',
    'Dark Valrhona chocolate cake with molten center, accompanied by Madagascar vanilla bean gelato and raspberry coulis.',
    8.50,
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    true,
    true
  ),
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b04',
    'Tahitian Vanilla Bean Panna Cotta',
    'Silky chilled cream dessert infused with real vanilla bean, topped with seasonal macerated blackberries.',
    7.50,
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    true,
    false -- Marked 86'd (Sold Out) for live availability toggle demonstration
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available;

-- 4. Create Initial Demonstration Orders (For Live KDS Showcase)
INSERT INTO public.orders (
  id,
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
  notes,
  created_at
) VALUES
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '#104',
    'dine_in',
    'Table 4',
    'Alex Miller',
    '+1 (555) 987-6543',
    '[
      {
        "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04",
        "name": "Classic Truffle Burger",
        "price": 16.50,
        "quantity": 2,
        "instructions": "Extra crispy fries please",
        "itemTotal": 33.00
      },
      {
        "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c08",
        "name": "House Brewed Citrus Iced Tea",
        "price": 4.50,
        "quantity": 1,
        "instructions": "Light ice",
        "itemTotal": 4.50
      }
    ]'::JSONB,
    37.50,
    0.00,
    37.50,
    'pending',
    'First time diners - seating near window.',
    now() - interval '4 minutes'
  ),
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d02',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '#103',
    'dine_in',
    'Table 2',
    'Sarah Jenkins',
    '+1 (555) 345-6789',
    '[
      {
        "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c05",
        "name": "Wild Forest Mushroom Risotto",
        "price": 14.00,
        "quantity": 1,
        "instructions": null,
        "itemTotal": 14.00
      }
    ]'::JSONB,
    14.00,
    0.00,
    14.00,
    'preparing',
    NULL,
    now() - interval '12 minutes'
  ),
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d03',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '#102',
    'takeaway',
    NULL,
    'David Lee',
    '+1 (555) 456-7890',
    '[
      {
        "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01",
        "name": "Crispy Rosemary Bruschetta",
        "price": 9.50,
        "quantity": 3,
        "instructions": "Packed in separate boxes",
        "itemTotal": 28.50
      }
    ]'::JSONB,
    28.50,
    0.00,
    28.50,
    'ready',
    'Customer waiting in car outside.',
    now() - interval '20 minutes'
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  items = EXCLUDED.items;

-- ==============================================================================
-- 5. Helper Function: Linking Supabase Auth Users to Restaurant Staff
-- ==============================================================================
-- Because Supabase Auth user IDs are generated upon user registration,
-- this procedure allows the developer or administrator to link any newly registered
-- staff email address to "The Bistro Downtown" with a single command.

CREATE OR REPLACE FUNCTION public.link_demo_staff_user(
  p_user_email TEXT,
  p_full_name TEXT DEFAULT 'Restaurant Manager',
  p_role TEXT DEFAULT 'admin',
  p_restaurant_slug TEXT DEFAULT 'the-bistro'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_restaurant_id UUID;
BEGIN
  -- Look up user ID from Supabase auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_user_email;

  IF NOT FOUND THEN
    RETURN format('ERROR: User with email "%s" not found in Supabase Auth. Please create the user first in the Supabase Dashboard.', p_user_email);
  END IF;

  -- Look up restaurant ID
  SELECT id INTO v_restaurant_id
  FROM public.restaurants
  WHERE slug = p_restaurant_slug;

  IF NOT FOUND THEN
    RETURN format('ERROR: Restaurant with slug "%s" not found.', p_restaurant_slug);
  END IF;

  -- Insert or update staff membership
  INSERT INTO public.restaurant_staff (restaurant_id, user_id, full_name, role)
  VALUES (v_restaurant_id, v_user_id, p_full_name, p_role)
  ON CONFLICT (restaurant_id, user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

  RETURN format('SUCCESS: Linked "%s" (User ID: %s) as "%s" to restaurant "%s"', p_user_email, v_user_id, p_role, p_restaurant_slug);
END;
$$;

-- Example execution (Run after creating manager@bistro.com in Supabase Auth):
-- SELECT public.link_demo_staff_user('manager@bistro.com', 'Bistro Operations Manager', 'admin', 'the-bistro');
