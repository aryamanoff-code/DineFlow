# AGENTS.md - Developer & AI Agent Guidelines for DineFlow

This document defines persistent development standards, architectural boundaries, and operational rules for AI agents and software engineers contributing to the **DineFlow** codebase. Adhere strictly to these rules across all implementations.

---

## 1. Core Principles & Technology Standards

- **Strict TypeScript**: TypeScript must be used across the entire application without exception. Avoid `any` types; utilize explicit type annotations, strict null checks, and shared domain models defined under `src/types/`.
- **Maintain Architectural Separation**: Keep `features/customer/` and `features/admin/` strictly isolated. Customer-facing flows (menu browsing, cart, checkout) must never couple directly to administrative logic (kitchen display, inventory management, analytics).
- **Reusable UI Components**: Leverage shared UI primitives in `src/components/ui/` (buttons, modals, badges, inputs) and layout wrappers in `src/components/layout/`. Avoid duplicating base component logic across feature modules.
- **Service Layer Encapsulation**: Keep all database queries, mutations, and Supabase client calls inside `src/services/`. **Never import or call the Supabase client directly from UI components or page files.**
- **Strongly-Typed Service Functions**: Every service function must define explicit parameter interfaces and promise return types (e.g., `Promise<ServiceResponse<Order>>`), abstracting Supabase response formats (`data`, `error`) away from UI views.
- **Component Modularity**: Adhere to the Single Responsibility Principle. Avoid bloated files (> 200 lines). Break pages into smaller, testable sub-components, custom hooks, and utility functions.
- **Environment Variable Discipline**: Read configuration exclusively from `import.meta.env`. Never hardcode endpoints or configuration parameters. Use fallback validation on startup.

---

## 2. Security & Supabase Safety Rules

- **Zero Secret Leakage**: Never commit API keys, service role credentials, or environment secrets to Git. Maintain `.env.example` with blank placeholder values only.
- **Anonymized Client Scope**: Only use the public anonymous key (`VITE_SUPABASE_PUBLISHABLE_KEY`) on the client frontend. **Never expose or reference the Supabase `service_role` key in frontend code.**
- **Row Level Security (RLS)**: Every database table created in Supabase must have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`). Customer policies must be scoped to read-only for public menus and restricted order creation; administrative mutations must require authenticated staff tokens matching valid restaurant associations.
- **Strict Input Validation**: Validate all client-side inputs (table numbers, item quantities, form fields, notes) prior to dispatching service layer calls. Sanitize user text inputs to prevent injection attacks.

---

## 3. UI/UX & Quality Assurance Guidelines

- **Comprehensive Responsive Design**: The customer application is primarily mobile-first (optimized for smartphone QR scans, 360px–430px widths), but must seamlessly scale across tablets and desktop monitors. The admin dashboard must provide clear visibility on desktop screens (KDS / operations monitors) and mobile tablets.
- **Four Fundamental UI States**: Every UI view that fetches or mutates asynchronous data must explicitly handle:
  1. **Loading State**: Accessible skeletons, spinners, or loading progress bars.
  2. **Error State**: User-friendly, actionable error messages with retry actions.
  3. **Empty State**: Contextual empty screens with explanatory messages (e.g., "Your cart is empty", "No active orders").
  4. **Success State**: Clear confirmations (e.g., order placed modal, item updated toast).
- **Lean Dependencies**: Avoid installing external npm libraries for trivial tasks. Evaluate bundle size and runtime overhead prior to adding any new dependency.
- **No Silent Regressions**: Do not modify unrelated files or change function signatures outside the immediate task scope without explicit instruction.
- **Verification Before Completion**: Run TypeScript checks (`tsc --noEmit`), linters, and test suites after every code change. **Never claim a feature is complete or functional without active verification.**

---

## 4. Directory & Code Organization Conventions

```
src/
├── app/                  # App shell, routing providers, global contexts
├── components/
│   ├── ui/               # Atomic design primitives (Button, Modal, Input, Badge, Toast)
│   └── layout/           # Shared structural wrappers (Navbar, Sidebar, Container)
├── features/
│   ├── customer/         # Customer feature bundle
│   │   ├── components/   # Menu catalog, cart sheet, table selector, order card
│   │   ├── pages/        # Customer landing, menu view, cart review, order confirmation
│   │   ├── hooks/        # useCart, useMenu, useCustomerOrder
│   │   └── utils/        # Price calculators, currency formatters
│   └── admin/            # Restaurant administration feature bundle
│       ├── components/   # Live order board (KDS), menu manager table, QR generator
│       ├── pages/        # Admin login, active orders, menu editor, analytics overview
│       ├── hooks/        # useLiveOrders, useMenuManagement, useAdminAuth
│       └── utils/        # Status transitions, metrics aggregators
├── services/             # Supabase client, API contracts, typed service methods
│   ├── supabaseClient.ts # Initialized Supabase client instance
│   ├── menuService.ts    # Fetch categories, items, toggle availability
│   ├── orderService.ts   # Create orders, fetch active orders, update status
│   └── authService.ts    # Staff authentication and session handling
├── types/                # Canonical TypeScript models, DTOs, and enums
└── styles/               # Tailwind CSS entry points, theme overrides
```

---

## 5. Agent Operational Checklist

When executing tasks in this repository, each AI agent must follow this cycle:
1. **Analyze**: Review relevant documentation in `docs/` and examine existing service contracts.
2. **Design**: Plan changes matching the established folder structure without introducing unnecessary packages.
3. **Implement**: Write clean, modular, typed code inside the designated feature or service folders.
4. **Verify**: Ensure types pass compilation and error states are accounted for.
5. **Report**: Concisely summarize changes, reference edited files, and state next steps without unverified claims.
