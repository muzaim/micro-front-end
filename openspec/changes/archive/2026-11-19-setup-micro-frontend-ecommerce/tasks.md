# Tasks

## 1. Monorepo & Shared Packages Setup

- [x] 1.1 Initialize root `package.json`, `pnpm-workspace.yaml`, and `.gitignore`, verifying workspace structure is recognized by pnpm.
- [x] 1.2 Scaffold `packages/shared-types` defining `Product` and `CartItem` interfaces and verify TypeScript build output.
- [x] 1.3 Scaffold `packages/shared-events` providing typed event publisher and listener helpers for `cart:add-item` events and verify exports.

## 2. Catalog Remote Application (`apps/catalog`)

- [x] 2.1 Scaffold `apps/catalog` with Vite, React, and `@originjs/vite-plugin-federation` on port 3001, verifying standalone dev server launches.
- [x] 2.2 Implement mock catalog data, `ProductCard`, and `ProductList` components, verifying products render cleanly in standalone mode.
- [x] 2.3 Integrate `shared-events` into the "Add to Cart" button to dispatch `cart:add-item` custom events and verify event payload.
- [x] 2.4 Configure Module Federation in `apps/catalog/vite.config.ts` exposing `./ProductList` with `react` and `react-dom` as shared singletons.

## 3. Cart Remote Application (`apps/cart`)

- [x] 3.1 Scaffold `apps/cart` with Vite, React, and `@originjs/vite-plugin-federation` on port 3002, verifying standalone dev server launches.
- [x] 3.2 Implement reactive cart state listener subscribing to `cart:add-item` events and storing items in memory/local storage.
- [x] 3.3 Implement `MiniCartBadge` component displaying item count and verify it updates dynamically when item events arrive.
- [x] 3.4 Implement `CartPage` component rendering line items, quantity increment/decrement/remove controls, and calculated total summary.
- [x] 3.5 Configure Module Federation in `apps/cart/vite.config.ts` exposing `./MiniCartBadge` and `./CartPage` with shared React singletons.

## 4. Shell Host Application (`apps/shell`)

- [x] 4.1 Scaffold `apps/shell` with Vite, React, React Router, and `@originjs/vite-plugin-federation` configured for port 3000.
- [x] 4.2 Configure Module Federation in `apps/shell/vite.config.ts` defining remotes for `catalog` (port 3001) and `cart` (port 3002).
- [x] 4.3 Implement `RemoteBoundary` component with fallback error display to gracefully handle remote failures.
- [x] 4.4 Build Shell layout with persistent Header (embedding remote `MiniCartBadge`), navigation links, and footer.
- [x] 4.5 Configure client-side routing to dynamically load remote `ProductList` on `/` and `/products`, and remote `CartPage` on `/cart`.

## 5. Integration & Verification

- [x] 5.1 Configure root scripts (`dev:all`, `build:all`) to concurrently run or build all micro-apps and packages.
- [x] 5.2 Verify complete user flow: browse products in Shell (port 3000), add item to cart, verify header badge updates instantly, and view cart page.
- [x] 5.3 Test error boundary resilience: shut down the cart remote service and verify Shell renders catalog and fallback without breaking.
