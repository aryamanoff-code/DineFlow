# Supabase Database Setup & Security Guide: DineFlow

This document provides complete instructions for provisioning, configuring, and verifying the **DineFlow** database on Supabase for development and hackathon presentations.

---

## 1. Architecture & Security Overview

DineFlow uses **Supabase PostgreSQL** as its managed relational backend, leveraging:
- **Strict Row Level Security (RLS)**: Enforced across all tables.
- **Least-Privilege Public Access**: Anonymous diners can only read active menus and submit orders through a secure database function.
- **Tamper-Proof Order Calculation**: All line item pricing and totals are computed strictly on the database engine, ignoring any client-manipulated payload prices.
- **Supabase Realtime (CDC)**: Publishes PostgreSQL write-ahead log updates on the `orders` table directly to authenticated kitchen dashboards over WebSockets.

---

## 2. Step-by-Step Provisioning Guide (Supabase Web Console)

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New Project** and configure:
   - **Name**: `DineFlow-Production` (or `DineFlow-Hackathon`)
   - **Database Password**: Set a strong password and save it in a password manager.
   - **Region**: Select the closest geographic region to minimize latency.
3. Once the project finishes provisioning (~2 minutes), navigate to **Project Settings** -> **API**.
4. Copy the following credentials into your local `.env.local` file:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
   ```

> [!CAUTION]
> **Zero Secret Leakage**: Never paste the `service_role` key into `.env.local` or any frontend code. Only use the public anonymous key (`anon`).

---

### Step 2: Apply the Initial Schema Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/migrations/20261113000000_initial_schema.sql`](../supabase/migrations/20261113000000_initial_schema.sql).
4. Paste into the SQL editor and click **Run**.
5. Verify output:
   - Tables created: `restaurants`, `menu_categories`, `menu_items`, `restaurant_staff`, `orders`.
   - RLS enabled on all 5 tables.
   - RPC functions created: `create_customer_order`, `get_customer_order`, `is_restaurant_staff`, `is_restaurant_admin`.
   - Realtime publication updated for `orders`.

---

### Step 3: Run the Seed Data Script
1. In the **SQL Editor**, click **New Query**.
2. Copy the entire contents of [`supabase/seed.sql`](../supabase/seed.sql).
3. Paste into the SQL editor and click **Run**.
4. Verify output:
   - Demo restaurant created: **The Bistro Downtown** (`slug: the-bistro`).
   - 4 Categories created (Starters, Main Course, Beverages, Desserts).
   - 12 Menu items created with photos and dietary labels (including 2 items marked as 86'd / Sold Out).
   - 3 Demonstration orders placed for the Kitchen Display System (KDS).
   - Helper function `link_demo_staff_user` created.

---

### Step 4: Create an Authorized Demo Staff Account

To access the restaurant admin portal (`/admin`), you must create an authenticated user in Supabase Auth and link them to the demo restaurant:

1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Fill in:
   - **Email**: `manager@bistro.com`
   - **Password**: `admin123456` (or a password of your choice)
   - **Auto Confirm User**: **Checked** (ensures immediate login without email verification)
4. Click **Create User**.

---

### Step 5: Link the Staff Account to the Demo Restaurant

1. Return to the **SQL Editor** in Supabase.
2. Execute the linking procedure:
   ```sql
   SELECT public.link_demo_staff_user('manager@bistro.com', 'Bistro General Manager', 'admin', 'the-bistro');
   ```
3. The function will look up the newly created `auth.users` ID and securely link it into `public.restaurant_staff`.
4. Output should confirm:
   ```text
   SUCCESS: Linked "manager@bistro.com" (User ID: <uuid>) as "admin" to restaurant "the-bistro"
   ```

---

## 3. Alternative CLI Setup (For Supabase CLI Users)

If you prefer using the Supabase CLI locally:

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to your Supabase account
supabase login

# 3. Link your project
supabase link --project-ref <your-project-id>

# 4. Push migrations to remote database
supabase db push

# 5. Seed the database
supabase db reset # (or execute seed.sql via psql/dashboard)
```

---

## 4. Verification & Security Testing Checklist

Run these SQL snippets in the Supabase SQL Editor to verify access controls and business logic:

### Test 1: Public Menu Access (Should SUCCEED)
```sql
-- Public/anonymous can read active restaurants and categories
SELECT id, name, slug, is_active FROM public.restaurants WHERE slug = 'the-bistro';
SELECT name, price, is_available FROM public.menu_items WHERE is_available = true LIMIT 5;
```

### Test 2: Privacy Check on Staff Data (Should RETURN 0 ROWS for Anonymous)
```sql
-- Anonymous users cannot read restaurant staff profiles
SET ROLE anon;
SELECT * FROM public.restaurant_staff; -- Must return 0 rows
RESET ROLE;
```

### Test 3: Direct Order Table Access (Should BE RESTRICTED for Anonymous)
```sql
-- Anonymous users cannot browse all orders directly
SET ROLE anon;
SELECT * FROM public.orders; -- Must return 0 rows
RESET ROLE;
```

### Test 4: Transactional Order Creation with Database Price Verification
```sql
-- Test placing an order through the secure RPC
SELECT public.create_customer_order(
  p_restaurant_id := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  p_order_type := 'dine_in',
  p_customer_name := 'Test Diner',
  p_table_number := '4',
  p_items := '[
    {
      "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04",
      "quantity": 1,
      "instructions": "Extra sauce"
    }
  ]'::JSONB
);
```
*Expected Result*: Returns a JSON object with `success: true`, `orderNumber: "#105"`, `totalAmount: 16.50` (calculated from database price), and `status: "pending"`.

### Test 5: Sold-Out Item Rejection (Should RAISE EXCEPTION)
```sql
-- Test ordering an 86'd item (Nitro Cold Brew Coffee: c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10)
SELECT public.create_customer_order(
  p_restaurant_id := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  p_order_type := 'dine_in',
  p_customer_name := 'Test Diner',
  p_table_number := '4',
  p_items := '[
    {
      "itemId": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c10",
      "quantity": 1
    }
  ]'::JSONB
);
```
*Expected Result*: `ERROR: Menu item "Nitro Cold Brew Coffee" is currently sold out and unavailable`.

---

## 5. Supabase Realtime Verification

To verify that the Kitchen Display System (KDS) receives live tickets:
1. In the Supabase Dashboard, go to **Database** -> **Publications**.
2. Click on **`supabase_realtime`**.
3. Confirm that the `public.orders` table has **Enabled** checked.
4. When new rows are inserted or updated via `create_customer_order` or staff status updates, Supabase broadcasts WebSocket events to connected frontend clients.
