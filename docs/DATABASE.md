# Database Architecture & Entity Specifications: DineFlow

## 1. Overview & Data Model Design

DineFlow uses **Supabase PostgreSQL** as its relational database. The schema is normalized to ensure relational integrity across multi-table operations, with JSONB optimization for flexible order item snapshots.

The schema comprises five core entities:
1. `restaurants`: Core business profile.
2. `menu_categories`: Groupings for dishes (e.g., Starters, Mains, Drinks).
3. `menu_items`: Individual food and beverage items with pricing and stock availability.
4. `restaurant_staff`: Profile records mapping Supabase Auth users (`auth.users`) to restaurant tenancies.
5. `orders`: Customer orders capturing line items, table number, fulfillment type, and lifecycle state.

---

## 2. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    restaurants ||--o{ menu_categories : "defines"
    restaurants ||--o{ menu_items : "offers"
    restaurants ||--o{ restaurant_staff : "employs"
    restaurants ||--o{ orders : "receives"
    menu_categories ||--o{ menu_items : "categorizes"

    restaurants {
        uuid id PK
        text name
        text slug
        text address
        text phone
        text currency
        timestamp created_at
        timestamp updated_at
    }

    menu_categories {
        uuid id PK
        uuid restaurant_id FK
        text name
        int display_order
        timestamp created_at
    }

    menu_items {
        uuid id PK
        uuid restaurant_id FK
        uuid category_id FK
        text name
        text description
        numeric price
        text image_url
        boolean is_veg
        boolean is_available
        timestamp created_at
        timestamp updated_at
    }

    restaurant_staff {
        uuid id PK
        uuid user_id FK
        uuid restaurant_id FK
        text full_name
        text role
        timestamp created_at
    }

    orders {
        uuid id PK
        uuid restaurant_id FK
        text order_type
        text table_number
        text customer_name
        text customer_phone
        jsonb items
        numeric total_amount
        text status
        text notes
        timestamp created_at
        timestamp updated_at
    }
```

---

## 3. Detailed Entity Definitions

### 3.1. `restaurants`
Represents an onboarded restaurant location.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Unique restaurant identifier |
| `name` | `TEXT` | `NOT NULL` | Business legal/trading name |
| `slug` | `TEXT` | `UNIQUE, NOT NULL` | URL-friendly identifier (e.g., `the-bistro`) |
| `address` | `TEXT` | `NULL` | Physical address |
| `phone` | `TEXT` | `NULL` | Contact telephone number |
| `currency` | `TEXT` | `DEFAULT 'USD', NOT NULL` | Currency symbol/code (`USD`, `EUR`, `INR`, etc.) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Last update timestamp |

---

### 3.2. `menu_categories`
Organizes menu items into display groups.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Category identifier |
| `restaurant_id`| `UUID` | `REFERENCES restaurants(id) ON DELETE CASCADE, NOT NULL` | Associated restaurant |
| `name` | `TEXT` | `NOT NULL` | Category name (e.g., "Starters", "Beverages") |
| `display_order`| `INT` | `DEFAULT 0, NOT NULL` | Sort order for display sequencing |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Creation timestamp |

---

### 3.3. `menu_items`
Individual dishes and beverages available for order.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Menu item identifier |
| `restaurant_id`| `UUID` | `REFERENCES restaurants(id) ON DELETE CASCADE, NOT NULL` | Associated restaurant |
| `category_id` | `UUID` | `REFERENCES menu_categories(id) ON DELETE SET NULL, NULL` | Associated category |
| `name` | `TEXT` | `NOT NULL` | Name of the dish |
| `description` | `TEXT` | `NULL` | Ingredients, description, or allergy notes |
| `price` | `NUMERIC(10,2)`| `NOT NULL, CHECK (price >= 0)` | Price per unit |
| `image_url` | `TEXT` | `NULL` | Public image preview URL |
| `is_veg` | `BOOLEAN` | `DEFAULT false, NOT NULL` | Vegetarian indicator |
| `is_available` | `BOOLEAN` | `DEFAULT true, NOT NULL` | 86'd / stock status toggle |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Last update timestamp |

---

### 3.4. `restaurant_staff`
Links Supabase authenticated accounts to a specific restaurant.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Staff profile identifier |
| `user_id` | `UUID` | `REFERENCES auth.users(id) ON DELETE CASCADE, UNIQUE, NOT NULL` | Supabase Auth user ID |
| `restaurant_id`| `UUID` | `REFERENCES restaurants(id) ON DELETE CASCADE, NOT NULL` | Operating restaurant |
| `full_name` | `TEXT` | `NOT NULL` | Staff member's display name |
| `role` | `TEXT` | `DEFAULT 'staff', NOT NULL` | Access role (`admin`, `manager`, `staff`) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Creation timestamp |

---

### 3.5. `orders`
Represents an incoming order ticket.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Order ticket identifier |
| `restaurant_id`| `UUID` | `REFERENCES restaurants(id) ON DELETE CASCADE, NOT NULL` | Target restaurant |
| `order_type` | `TEXT` | `CHECK (order_type IN ('dine_in', 'takeaway')), NOT NULL` | Order mode |
| `table_number` | `TEXT` | `NULL` | Table number (required if `order_type = 'dine_in'`) |
| `customer_name`| `TEXT` | `NOT NULL` | Customer display name |
| `customer_phone`|`TEXT` | `NULL` | Customer contact number |
| `items` | `JSONB` | `NOT NULL` | Array of ordered items, snapshot prices & quantities |
| `total_amount` | `NUMERIC(10,2)`| `NOT NULL, CHECK (total_amount >= 0)` | Total payable amount |
| `status` | `TEXT` | `DEFAULT 'pending', CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled'))` | Order state |
| `notes` | `TEXT` | `NULL` | Kitchen notes / special requests |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Placement timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Last status modification timestamp |

#### JSONB `items` Structure Example
```json
[
  {
    "itemId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "name": "Classic Truffle Burger",
    "price": 14.50,
    "quantity": 2,
    "instructions": "No onions please"
  },
  {
    "itemId": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    "name": "House Brewed Iced Tea",
    "price": 4.00,
    "quantity": 1,
    "instructions": "Less ice"
  }
]
```

---

## 4. Row Level Security (RLS) Strategy

All tables enforce RLS:

1. **`restaurants`**:
   - `SELECT`: Public access (`true`).
   - `INSERT / UPDATE / DELETE`: Only authenticated staff where `restaurant_staff.role = 'admin'`.
2. **`menu_categories` & `menu_items`**:
   - `SELECT`: Public access (`true`).
   - `INSERT / UPDATE / DELETE`: Authenticated staff linked to `restaurant_id`.
3. **`orders`**:
   - `INSERT`: Public anonymous users (`true`).
   - `SELECT (single)`: Public anonymous users where `id = current_order_id` (via receipt token or explicit ID query).
   - `SELECT (all) & UPDATE`: Authenticated staff where `restaurant_id = auth.user_restaurant_id()`.

---

## 5. Supabase Realtime Publication

To enable the Live Kitchen Display System, the `orders` table is registered in the Supabase Realtime publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```
