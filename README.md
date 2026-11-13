# DineFlow

> **Digital Ordering and Restaurant Management Platform for Local Restaurants**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://dineflow07.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 1. Project Title & Overview

- **Project Title**: **DineFlow**
- **Tagline**: Empowering local restaurants with zero-friction digital ordering, real-time kitchen operations, and instant menu agility.
- **Repository**: [https://github.com/aryamanoff-code/DineFlow](https://github.com/aryamanoff-code/DineFlow)
- **Live Production Deployment**: [https://dineflow07.vercel.app/](https://dineflow07.vercel.app/)
- **Demo Diner Menu (Table 4)**: [https://dineflow07.vercel.app/r/the-bistro?table=4](https://dineflow07.vercel.app/r/the-bistro?table=4)
- **Admin & Kitchen KDS Portal**: [https://dineflow07.vercel.app/admin/login](https://dineflow07.vercel.app/admin/login)

**DineFlow** is an open, modern, web-first ordering and restaurant operations platform engineered specifically for independent and local dining establishments. By eliminating the necessity for costly proprietary POS hardware and removing the barrier of native app downloads for patrons, DineFlow enables diners to scan a table-specific QR code, explore categorized menus, customize selections, and submit orders directly via their smartphone browser.

Concurrently, restaurant staff manage incoming tickets through a web-based Kitchen Display System (KDS) powered by Supabase Realtime WebSockets, updating preparation stages and toggling menu item availability on the fly.

---

## 2. Problem Statement & Solution

### The Challenge for Local Restaurants
Local dining establishments operate under constrained profit margins and limited technical infrastructure:
- **Prohibitive Hardware & Software Costs**: Enterprise POS ecosystems (such as Toast, Micros, or Clover) impose thousands of dollars in proprietary hardware purchases and rigid multi-year licensing subscriptions.
- **Diner Friction**: Requiring patrons to download native mobile apps or register accounts introduces conversion drop-offs exceeding 60% at the table.
- **Inefficient Communication**: Physical paper menus become obsolete the moment an ingredient runs out (86'd items), forcing waitstaff into time-consuming verbal explanations.
- **Peak-Hour Bottlenecks**: Customer wait times surge during rush periods because staff must split time between order-taking, payment processing, and food delivery.

### The DineFlow Solution
1. **Zero-App Smartphone Ordering**: Standard browsers on patrons' existing devices launch an instant ordering terminal via dynamic QR codes (`/r/:slug?table=X`).
2. **Instant Ticket Dispatch**: Tickets stream directly to kitchen screens using Supabase Realtime WebSockets without browser reloads.
3. **Dynamic Menu Agility**: Managers can 86'd sold-out items or tune prices in seconds, automatically disabling them on customer menus and preventing checkout of unavailable items.
4. **Resilient Cloud & Offline Architecture**: Runs against live Supabase cloud infrastructure and gracefully supports self-contained offline demonstrations with an in-memory event-driven bus.

```
+------------------------------------------------------------------------------------------+
|                                        DineFlow                                          |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|     +----------------------------------+        +----------------------------------+     |
|     |       Customer Mobile App        |        |     Restaurant Admin Dashboard   |     |
|     +----------------------------------+        +----------------------------------+     |
|     | - QR table resolution (?table=X) |        | - Protected staff authentication |     |
|     | - Categorized filterable menu    |        | - Live KDS order feed (Realtime) |     |
|     | - Dietary & price transparency   |        | - Lifecycle ticket transitions   |     |
|     | - Persistent shopping cart       |        | - Instant 86'd stock toggle      |     |
|     | - Dine-In / Takeaway selection   |        | - Table QR code studio (SVG/PNG) |     |
|     | - Real-time order confirmation   |        | - Operations analytics dashboard |     |
|     +----------------------------------+        +----------------------------------+     |
|                       \                                      /                           |
|                        \                                    /                            |
|                         v                                  v                             |
|               +------------------------------------------------------+                   |
|               |        Supabase Managed Backend & Services           |                   |
|               |  (PostgreSQL 15, Row Level Security, Realtime WS)    |                   |
|               +------------------------------------------------------+                   |
+------------------------------------------------------------------------------------------+
```

---

## 3. Implemented Features & Verification Status

All core capabilities are fully implemented, verified via automated test suites, and deployed live to Vercel:

### Customer Interface (`/` & `/r/:slug`)
- [x] **Dynamic QR Table Code Resolution**: Automatically parses table numbers from query parameters (e.g., `/r/the-bistro?table=4`) and displays a persistent table badge.
- [x] **Categorized Menu Catalog**: Filterable categories (Starters, Mains, Beverages, Desserts), search bar, and vegetarian dietary badges.
- [x] **Dish Customization Modal**: Real-time quantity adjustments and special instruction notes (e.g., "extra sauce", "no onions").
- [x] **Interactive Shopping Cart**: Client-cached cart drawer (`localStorage`) with quantity steppers, item removal, and subtotal calculation.
- [x] **Dine-In vs. Takeaway Fulfillment**: Dine-in validation enforcing required table numbers, prefilled from QR codes.
- [x] **Pay-at-Counter Messaging**: Clear messaging that orders go directly to the kitchen with cash/card settlement upon service.
- [x] **Authoritative 86'd Stock Enforcement**: Sold-out dishes display "Sold Out" badges with disabled buttons, and order submission rejects 86'd items server-side.
- [x] **Order Confirmation Modal**: Instant confirmation dialog displaying unique sequential order numbers (e.g., `#105`), item breakdowns, and pending status.

### Restaurant Admin Dashboard (`/admin`)
- [x] **Protected Staff Authentication**: Email/password authentication via Supabase Auth with route protection redirecting unauthenticated visitors to `/admin/login`.
- [x] **Operations Overview (`/admin`)**: Real-time business metrics computed from active orders (Gross Sales Today, Total Orders, Pending, Preparing, Ready, Completed).
- [x] **Live Kitchen Display System (`/admin/orders`)**: Chronological ticket cards grouped by lifecycle status with filter tabs.
- [x] **Sub-Second Realtime Synchronization**: New customer orders pop onto the KDS board automatically via Supabase Realtime without browser refresh.
- [x] **Order Lifecycle Controls**: One-click status transitions (`pending` -> `preparing` -> `ready` -> `completed` / `cancelled`).
- [x] **Menu & 86'd Manager (`/admin/menu`)**: Table catalog view with instant availability toggles, dish creation, and price editing.
- [x] **Table QR Studio (`/admin/settings`)**: Interactive QR stand preview for any table number, browser printing, and high-resolution 600x600 PNG download.

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose & Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^18.3.1` | Declarative, component-based UI architecture with fast rendering. |
| **Language** | TypeScript | `^5.7.3` | Strict type safety across domain models, service contracts, and components. |
| **Build Tool** | Vite | `^5.4.14` | Sub-second Hot Module Replacement (HMR) and optimized Rollup production builds. |
| **Routing** | React Router DOM | `^6.28.2` | Client-side routing with nested layouts, query param parsing, and route protection. |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility-first responsive design system with custom forest-green & warm food palettes. |
| **Database** | PostgreSQL (Supabase) | `15.x` | Relational database with ACID transactions, JSONB snapshots, and Row Level Security. |
| **Authentication** | Supabase Auth (GoTrue)| `^2.48.1` | Token-based staff session management with secure JWT validation. |
| **Realtime Engine** | Supabase Realtime | WebSocket | Postgres Change Data Capture (CDC) streaming delta updates for live ticket arrival. |
| **Icons** | Lucide React | `^0.475.0` | Accessible, lightweight icon primitives. |
| **QR Generation** | `qrcode.react` | `^4.2.0` | Client-side SVG/Canvas QR generation for table-specific and general menu URLs. |
| **Deployment** | Vercel | Cloud | Edge-optimized hosting with global CDN caching and SPA rewrite routing (`vercel.json`). |

---

## 5. Working Routes & Application Navigation

| Route | Interface | Guard | Description |
| :--- | :--- | :--- | :--- |
| `/` | Customer | Public | Landing page with quick-jump table QR simulations (Tables 1–12) and staff links. |
| `/r/:slug` | Customer | Public | Mobile-first restaurant catalog. Prefills dine-in table via `?table=X`. |
| `/admin/login` | Admin | Public | Staff portal login with email/password authentication. |
| `/admin` | Admin | Protected | Executive dashboard with metrics computed from live tickets. |
| `/admin/orders` | Admin | Protected | Realtime Kitchen Display System (KDS) board with status filters. |
| `/admin/menu` | Admin | Protected | Menu catalog management with instant 86'd stock toggle. |
| `/admin/settings` | Admin | Protected | Table-specific and general QR stand studio with print/download. |

---

## 6. Repository Architecture & Directory Structure

```
DineFlow/
├── README.md                           # Master project documentation & live demo guide
├── AGENTS.md                           # Developer guidelines & architectural boundaries
├── vercel.json                         # Vercel SPA routing rewrite configuration
├── package.json                        # Dependencies, scripts, and package metadata
├── tsconfig.json                       # Strict TypeScript compiler configuration
├── tailwind.config.js                  # Warm culinary theme & custom color definitions
├── vite.config.ts                      # Vite build pipeline and plugin configurations
├── docs/                               # Core architecture reference documentation
│   ├── ARCHITECTURE.md                 # System blueprints, data flow, and routing specifications
│   ├── DATABASE.md                     # PostgreSQL schema, ERD, indexes, and RLS policies
│   ├── API_CONTRACTS.md                # TypeScript models, DTOs, and typed service signatures
│   └── SUPABASE_SETUP.md               # Supabase provisioning, SQL migration, and seed guide
├── public/
│   └── assets/                         # Static assets (Favicon, logo, placeholders)
├── src/
│   ├── app/                            # Application entry and route declarations
│   │   └── App.tsx                     # React Router definition with protected route guards
│   ├── components/
│   │   ├── layout/                     # CustomerLayout, AdminLayout, NotFoundPage
│   │   └── ui/                         # Atomic primitives (Button, Modal, Card, Badge, States)
│   ├── features/
│   │   ├── customer/                   # Customer feature module (Menu, Cart, Checkout)
│   │   │   ├── components/             # MenuItemCard, CartDrawer, CheckoutModal, etc.
│   │   │   ├── hooks/                  # useMenu, useCart, useCustomerOrder
│   │   │   ├── pages/                  # LandingPage, MenuPage
│   │   │   └── utils/                  # customerService adapter, formatters, calculators
│   │   └── admin/                      # Admin feature module (KDS, Menu Editor, QR Studio)
│   │       ├── components/             # KDSOrderCard, MenuItemModal, QRPrintView, etc.
│   │       ├── hooks/                  # useAdminAuth, useLiveOrders, useMenuManagement
│   │       ├── pages/                  # LoginPage, DashboardOverviewPage, OrdersPage, etc.
│   │       └── utils/                  # adminService adapter, orderMetrics
│   ├── services/                       # Centralized, strongly-typed backend service layer
│   │   ├── supabaseClient.ts           # Supabase client instance with public anon key
│   │   ├── restaurantService.ts        # getRestaurantBySlug, getRestaurantById
│   │   ├── menuService.ts              # getMenu, setMenuItemAvailability, saveMenuItem
│   │   ├── orderService.ts             # createOrder, getOrders, subscribeToOrders, updateOrderStatus
│   │   └── authService.ts              # signIn, signOut, getCurrentSession
│   ├── types/                          # Canonical TypeScript interfaces, DTOs, and enums
│   │   └── index.ts                    # Restaurant, MenuItem, Order, StaffSession, ServiceResponse
│   ├── styles/
│   │   └── index.css                   # Tailwind entry point and global surface definitions
│   └── main.tsx                        # React application mounting point
├── supabase/
│   ├── migrations/                     # SQL schema migrations & RPC definitions
│   │   └── 20261113000000_initial_schema.sql # Base tables, RLS policies, triggers, and RPCs
│   └── seed.sql                        # Demonstration restaurant, categories, and dish dataset
└── tests/
    ├── backend_services_test.ts        # Automated unit tests for all service contracts (30 tests)
    └── integration_tests.ts            # End-to-end integration test suite Tests A–J (33 tests)
```

---

## 7. Local Setup & Installation

### Prerequisites
- **Node.js**: `v18.x` or higher (`v20.x` recommended)
- **npm**: `v9.x` or higher
- A free **Supabase** project (optional for live data; app runs out of the box in offline/demo mode)

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aryamanoff-code/DineFlow.git
   cd DineFlow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   Add your public Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   ```
   *(If omitted, DineFlow runs in self-contained offline/demo mode with mock seed data and local realtime events).*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 8. Verification & Test Commands

DineFlow includes automated test suites covering all backend services, error boundaries, input validations, and end-to-end integration workflows:

| Command | Target | Description |
| :--- | :--- | :--- |
| `npm run lint` | TypeScript (`tsc --noEmit`) | Verifies zero TypeScript errors, valid types, and clean imports. |
| `npm run build` | Production Bundle | Builds production-optimized distribution via Vite/Rollup into `dist/`. |
| `npx tsx tests/integration_tests.ts` | Integration Suite | Executes end-to-end scenarios Tests A through J (33 test assertions). |
| `npx tsx tests/backend_services_test.ts`| Service Layer Suite | Tests all Supabase service contracts, validation rules, and auth (30 assertions). |

### Demo Credentials
For testing the staff portal locally or on Vercel:
- **Staff Email**: `manager@bistro.com`
- **Password**: `admin123456`

---

## 9. Security & Architecture Guardrails

- **Zero Secret Exposure**: Only the public anonymous key (`VITE_SUPABASE_PUBLISHABLE_KEY`) is bundled on the frontend. The `service_role` key is never exposed.
- **Row Level Security (RLS)**: Public access is restricted to read-only menu queries and order submission via the atomic `create_customer_order` PostgreSQL RPC. Staff mutations require authenticated JWT tokens matching the restaurant.
- **Service Layer Encapsulation**: UI components never call Supabase directly. All database access passes through strongly typed methods in `src/services/` returning `Promise<ServiceResponse<T>>`.
- **Database Price Authority**: Line item prices are recalculated and verified on the server side; clients cannot tamper with total amounts or order unavailable dishes.
