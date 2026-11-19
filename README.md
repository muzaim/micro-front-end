# Micro Frontend E-Commerce

A modern, modular e-commerce web platform demonstrating Micro Frontend (MFE) architecture built with React, Vite Module Federation, TypeScript, and a pnpm monorepo.

---

## Architectural Overview

This project separates concerns by business domain, dividing the frontend into independent micro-applications that can be developed, tested, and deployed independently, or integrated seamlessly at runtime via Vite Module Federation.

```
+-------------------------------------------------------------------------------------------------+
|                                     Host Shell (Port 3000)                                      |
|  - Layout (Header, Navigation, Footer)                                                          |
|  - Authentication Session Store & Multi-User Login Modal (1-Click Autofill)                     |
|  - Root Routing & Lazy Dynamic Imports with Fallback Error Boundaries                           |
|  - Embeds MiniCartBadge from Cart Remote                                                        |
+-------------------------------------------------------------------------------------------------+
          |                                  |                                  |
          v                                  v                                  v
+-----------------------+          +-----------------------+          +-----------------------+
| Catalog Remote (3001) |          |   Cart Remote (3002)  |          |  Orders Remote (3003) |
| - Product catalog     |          | - User-scoped cart    |          | - Checkout & payment  |
| - Category filters    |          | - Mini-cart badge     |          | - Order history list  |
| - Emits cart events   |          | - Reactive auth sync  |          | - Scoped by userId    |
+-----------------------+          +-----------------------+          +-----------------------+
          │                                  │                                  │
          └──────────────────────────────────┴──────────────────────────────────┘
                                             │
                                             ▼
                   Typed Event Bus (@mfe/shared-events) & LocalStorage
```

---

## Workspace Structure

```text
micro-front-end/
├── apps/
│   ├── shell/           # Host application & Auth Provider (Port 3000)
│   ├── catalog/         # Catalog remote micro-app (Port 3001)
│   ├── cart/            # Cart remote micro-app (Port 3002)
│   └── orders/          # Orders & Checkout remote micro-app (Port 3003)
├── packages/
│   ├── shared-types/    # TypeScript interfaces (Product, CartItem, Order, AuthUser)
│   └── shared-events/   # Type-safe browser event bus for cross-MFE communication
├── openspec/            # OpenSpec specifications and historical change archives
├── pnpm-workspace.yaml
└── package.json
```

---

## Key Highlights

- **Vite Module Federation**: Integrates remote micro-apps dynamically at runtime using `@originjs/vite-plugin-federation`.
- **Shared Dependency Singletons**: `react` and `react-dom` are loaded as shared singletons across all remotes, preventing runtime conflicts and hook state desynchronization.
- **Loosely-Coupled Event Bus**: Micro-frontends communicate via type-safe browser window events (`cart:add-item`, `cart:clear`, `auth:state-change`, `order:created`).
- **Resilient Error Boundaries**: If a remote goes down or fails to start, `RemoteBoundary` isolates the failure and displays a graceful fallback UI without crashing the host application.
- **Multi-User Demo Support & 1-Click Autofill**:
  - **Budi Santoso**: `budi@mfe.com` (alias: `user@mfe.com`) | `password123` (ID: `usr-001`)
  - **Siti Rahma**: `siti@mfe.com` | `password123` (ID: `usr-002`)
  - **Andi Pratama**: `andi@mfe.com` | `password123` (ID: `usr-003`)
- **Strict User Data Isolation**:
  - **Shopping Cart**: Automatically scoped by user identity (`mfe_ecommerce_cart_<userId>` and `mfe_ecommerce_cart_guest`). When switching accounts or logging out, the cart reactively switches without data leakage.
  - **Order History**: Scoped strictly by `userId`. Users only see orders placed under their own account.

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Installation

Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/muzaim/micro-front-end.git
cd micro-front-end
pnpm install
```

### Building the Project

Build shared packages first, followed by all micro-applications:

```bash
pnpm build
```

---

## Running the Applications

### Option A: Run All Apps Simultaneously (Production Preview)

To build and preview all four micro-applications with concurrent servers:

```bash
pnpm start
```

Or run development servers with hot module replacement:

```bash
pnpm dev:all
```

Once running, access the services:
- **Host Shell**: [http://localhost:3000](http://localhost:3000)
- **Catalog Remote**: [http://localhost:3001](http://localhost:3001)
- **Cart Remote**: [http://localhost:3002](http://localhost:3002)
- **Orders Remote**: [http://localhost:3003](http://localhost:3003)

### Option B: Run Individual Apps in Standalone Mode

Each micro-app can be developed in isolation:

```bash
# Work on Catalog only
pnpm --filter catalog dev

# Work on Cart only
pnpm --filter cart dev

# Work on Orders only
pnpm --filter orders dev

# Work on Host Shell only
pnpm --filter shell dev
```

---

## Available Endpoints & Routes

| Path | Served By | Description |
| :--- | :--- | :--- |
| `/` or `/products` | Shell -> Catalog Remote | Main storefront displaying product catalog with category filters |
| `/cart` | Shell -> Cart Remote | Shopping cart page with quantity controls and order summary |
| `/checkout` | Shell -> Orders Remote | Multi-step checkout with address form, payment options, and auth guard |
| `/orders` | Shell -> Orders Remote | "Pesanan Saya" page showing order history scoped strictly to active user |
| Header Badge | Shell -> Cart Remote | Mini-cart badge displaying dynamic real-time item count |
| Login Modal | Shell | Host authentication modal with 1-click test account autofill |

---

## Specifications & Design

This project is planned and documented following the OpenSpec methodology:
- Specifications can be reviewed under [`openspec/specs/`](openspec/specs/)
- Change proposals, designs, and task histories are preserved under [`openspec/changes/archive/`](openspec/changes/archive/)

---

## License

MIT
