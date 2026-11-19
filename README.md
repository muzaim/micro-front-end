# Micro Frontend E-Commerce

A modern, modular e-commerce web platform demonstrating Micro Frontend (MFE) architecture built with React, Vite Module Federation, TypeScript, and a pnpm monorepo.

---

## Architectural Overview

This project separates concerns by domain, dividing the frontend into independent micro-applications that can be developed, tested, and deployed independently or integrated seamlessly at runtime.

```
+-------------------------------------------------------------+
|                     Host Shell (Port 3000)                  |
|  - Layout (Header, Navigation, Footer)                      |
|  - Root Routing & Lazy Dynamic Imports                      |
|  - Error Boundary Fallback                                  |
|  - Embeds MiniCartBadge from Cart                           |
+-------------------------------------------------------------+
         |                                           |
         v                                           v
+-----------------------------+             +-----------------------------+
|    Catalog Remote (Port 3001)|             |      Cart Remote (Port 3002) |
|  - Product listing grid     |             |  - Shopping cart state      |
|  - Category filters         |             |  - Mini-cart badge widget   |
|  - Dispatches cart events   |             |  - Dedicated cart page      |
+-----------------------------+             +-----------------------------+
```

---

## Workspace Structure

```text
micro-front-end/
├── apps/
│   ├── shell/           # Host application (Port 3000)
│   ├── catalog/         # Catalog remote micro-app (Port 3001)
│   └── cart/            # Cart remote micro-app (Port 3002)
├── packages/
│   ├── shared-types/    # TypeScript interfaces (Product, CartItem)
│   └── shared-events/   # Type-safe custom event bus for cross-MFE messaging
├── openspec/            # OpenSpec specifications and change archives
├── pnpm-workspace.yaml
└── package.json
```

---

## Key Highlights

- **Vite Module Federation**: Integrates components at runtime via `@originjs/vite-plugin-federation` without monolithic bundles.
- **Shared Dependency Singletons**: `react` and `react-dom` are loaded once as shared singletons across all remotes, preventing runtime conflicts and hook state duplication.
- **Loosely-Coupled Event Bus**: Remotes do not share mutable state stores. Catalog emits typed browser custom events (`cart:add-item`), while Cart listens reactively and maintains its own state.
- **Resilient Error Boundaries**: If a remote goes down or fails to load, `RemoteBoundary` isolates the failure and displays a graceful fallback UI without crashing the host shell.
- **Standalone Mode**: Each remote application can be launched and developed independently (`pnpm --filter catalog dev`) with mock shells.

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

Build shared packages first, followed by each micro-application:

```bash
pnpm build
```

---

## Running the Applications

### Option A: Run All Apps Simultaneously

To build and preview all three applications with concurrent servers:

```bash
pnpm start
```

Or run dev servers with hot module replacement:

```bash
pnpm dev:all
```

Once running, access the services:
- **Host Shell**: [http://localhost:3000](http://localhost:3000)
- **Catalog Remote**: [http://localhost:3001](http://localhost:3001)
- **Cart Remote**: [http://localhost:3002](http://localhost:3002)

### Option B: Run Individual Apps in Standalone Mode

You can run individual micro-apps independently for isolated feature development:

```bash
# Work on Catalog only
pnpm --filter catalog dev

# Work on Cart only
pnpm --filter cart dev

# Work on Shell only
pnpm --filter shell dev
```

---

## Available Endpoints & Routes

| Path | Served By | Description |
| :--- | :--- | :--- |
| `/` or `/products` | Shell -> Catalog Remote | Main storefront displaying the product catalog grid with category filters |
| `/cart` | Shell -> Cart Remote | Cart summary page with line items, quantity controls, and total calculations |
| Header Badge | Shell -> Cart Remote | Mini-cart badge rendered inside the host header displaying real-time item count |

---

## Specifications & Design

This project is planned and documented following the OpenSpec methodology:
- Specifications can be reviewed under [`openspec/specs/`](openspec/specs/)
- Change proposals, designs, and task histories are preserved under [`openspec/changes/archive/`](openspec/changes/archive/)

---

## License

MIT
