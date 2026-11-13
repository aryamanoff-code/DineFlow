# Problem Scope & Project Boundaries: DineFlow

## 1. Executive Summary

Small, independent, and local dine-in establishments frequently struggle to adopt digital ordering systems due to exorbitant hardware costs, cumbersome POS (Point of Sale) terminal installations, and high platform commissions (often 15%–30%) imposed by third-party delivery aggregators. 

**DineFlow** is conceived as a lightweight, web-first digital ordering and operations management platform. It enables local restaurants to establish an instant digital presence at negligible operating cost: customers scan a table-specific QR code to browse, customize, and submit orders directly from their smartphone browsers without installing an application, while staff manage incoming tickets in real time through an intuitive web-based kitchen/admin dashboard.

---

## 2. Problem Statement & Market Context

### The Challenge for Local Restaurants
1. **Financial Barrier to Digital POS**: Traditional restaurant management systems (Toast, Clover, Lightspeed) require specialized proprietary hardware, long-term contracts, and high recurring licensing fees.
2. **High Friction for Diners**: Many modern ordering solutions require patrons to download a native mobile app (iOS/Android) or register a full user profile just to order a single meal, resulting in customer abandonment.
3. **Menu Maintenance Inefficiencies**: Physical paper menus are expensive to reprint whenever prices fluctuate, items run out of stock (86'd items), or seasonal items rotate. Waitstaff waste time informing customers that requested dishes are unavailable.
4. **Order Bottlenecks & Labor Shortages**: During peak dining hours, customer wait times escalate due to limited floor staff taking orders table-by-table.

---

## 3. Proposed Solution

DineFlow addresses these challenges with a dual-interface web platform:

```
+--------------------------------------------------------------------------------+
|                                    DineFlow                                    |
+--------------------------------------------------------------------------------+
                                        |
          +-----------------------------+-----------------------------+
          |                                                           |
          v                                                           v
+-------------------------------+                           +-------------------------------+
|     Customer Application      |                           |   Restaurant Admin Dashboard  |
|  (Mobile-First, No App DL)    |                           |     (Live Operations & KDS)   |
+-------------------------------+                           +-------------------------------+
| - Scan Table QR Code          |                           | - Realtime Order Feed (KDS)   |
| - Filterable Categorized Menu |                           | - One-Click Status Transitions|
| - Dietary & Price Visibility  |                           | - Instant Menu Stock Toggles  |
| - Cart & Table/Takeaway Pick  |                           | - Table QR Code Generator     |
| - Instant Order Dispatch      |                           | - Session-Based Staff Auth    |
+-------------------------------+                           +-------------------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |    Supabase Backend (PostgreSQL,      |
                    |       Auth & Realtime WebSockets)     |
                    +---------------------------------------+
```

---

## 4. Target User Personas

| Persona | Role / Context | Primary Goals | Pain Points Solved |
| :--- | :--- | :--- | :--- |
| **Dine-In Customer** | Visiting a local bistro for dinner | Quick order placement without waiting for a waiter; view photos and allergen info. | No waiting for physical menus; transparent pricing; zero app installation. |
| **Takeaway Customer** | Ordering for pickup from the counter | Quick browse of menu, select takeaway option, receive order tracking ID. | Avoids standing in long queues at the cashier counter. |
| **Floor / Kitchen Staff** | Managing ticket flow during peak hours | Accurate, real-time ticket display; clear table numbers; quick status updates. | Eliminates illegible handwritten tickets and verbal order confusion. |
| **Restaurant Manager** | Owner or operations lead | Real-time control of menu item availability; generating QR codes for tables. | No reprints needed for sold-out items; instant operational agility. |

---

## 5. In-Scope MVP Features (12-Hour College Hackathon Scope)

The scope for this hackathon is rigorously targeted to deliver a fully functional, demonstrable end-to-end flow:

### A. Customer Interface
- **QR Code Entry & Table Resolution**: URL parameters parse the restaurant identifier and table number (e.g., `/?restId=...&table=4`).
- **Interactive Menu Catalog**: Category navigation (Appetizers, Mains, Drinks, Desserts), search filtering, dietary labels (Veg/Non-Veg), and item pricing.
- **Cart Management**: Add/remove items, adjust quantities, view running totals, and add special instructions per item.
- **Order Placement**: Selection between Dine-In (with table pre-fill) or Takeaway, customer name/phone field, and order submission.
- **Real-Time Order Confirmation**: Instant confirmation view displaying assigned Order ID, itemized receipt, and current status ("Received").

### B. Restaurant Admin Dashboard
- **Secure Staff Authentication**: Email and password authentication via Supabase Auth for authorized staff members.
- **Live Kitchen Display System (KDS)**: Real-time incoming order stream powered by Supabase WebSocket subscriptions.
- **Order Lifecycle Controls**: One-click status transitions (`pending` -> `preparing` -> `ready` -> `completed` / `cancelled`).
- **Menu Availability & Price Manager**: Table view of items with instant availability toggle (mark 86'd / sold-out) and price editing.
- **QR Code Generator Tool**: Utility to generate and download printable QR codes configured with specific table numbers and restaurant IDs.
- **Basic Operational Metrics**: At-a-glance dashboard indicators (Total Orders Today, Active Orders, Gross Sales volume).

---

## 6. Explicitly Out-of-Scope Features (Post-Hackathon Roadmap)

To guarantee high polish and completion within the 12-hour hackathon timeline, the following features are intentionally **excluded** from the MVP:

1. **Payment Gateway Integration (Stripe / Razorpay / Apple Pay)**: Orders will be processed as "Pay at Counter / Pay at Table" upon delivery. Integrating full merchant banking and webhooks is deferred.
2. **Customer User Accounts & Loyalty Systems**: Diners operate as guests to minimize conversion friction. Customer profiles, points, and stored payment methods are out of scope.
3. **Multi-Tenant Global Super-Admin**: The MVP focuses on single-restaurant multi-staff operations. Multi-chain tenancy management is out of scope.
4. **Physical Thermal Printer Integration (ESC/POS)**: Printing tickets via hardware ESC/POS or network serial connections is replaced with on-screen visual KDS cards.
5. **Driver Tracking & Delivery Logistics**: DineFlow serves dine-in and direct pickup only; out-of-house delivery driver routing is excluded.
6. **AI Recommendation Engines**: Dynamic upselling and personalized AI recommendation systems are deferred to future iterations.
