# Tasks

## 1. Shared Types & Events

- [x] 1.1 Update `packages/shared-types` to declare `AuthUser`, `AuthSession`, `ShippingAddress`, `PaymentMethod`, and `Order` models, and verify with `pnpm --filter @mfe/shared-types build`.
- [x] 1.2 Update `packages/shared-events` to add `auth:state-change`, `cart:clear`, and `order:created` events with publish/subscribe helpers, and verify with `pnpm --filter @mfe/shared-events build`.

## 2. Orders Micro Frontend (`apps/orders`)

- [x] 2.1 Scaffold `apps/orders` directory with Vite, React, TypeScript, and `@originjs/vite-plugin-federation` on port 3003, updating root `package.json` scripts.
- [x] 2.2 Implement `orderStore` in `apps/orders` for persisting and querying orders in `localStorage` (`mfe_ecommerce_orders`) tied to `userId`.
- [x] 2.3 Implement `CheckoutPage` in `apps/orders` with address fields, payment method selector, order summary, auth token validation, and order placement.
- [x] 2.4 Implement `OrdersPage` in `apps/orders` ("Pesanan Saya") to display chronological order cards with status, items, and total amount.
- [x] 2.5 Configure Vite Module Federation in `apps/orders/vite.config.ts` exposing `./CheckoutPage` and `./OrdersPage`, and verify build with `pnpm --filter @mfe/orders build`.

## 3. Host Shell Integration & Authentication (`apps/shell`)

- [x] 3.1 Implement auth utilities and Login modal in `apps/shell` validating credentials (`user@mfe.com` / `password123`) and managing `mfe_auth_session` in `localStorage`.
- [x] 3.2 Update `apps/shell/src/components/Header.tsx` to display login button when unauthenticated, and user profile badge, "Pesanan Saya" link, and logout button when logged in.
- [x] 3.3 Register `orders: 'http://localhost:3003/assets/remoteEntry.js'` in `apps/shell/vite.config.ts` and add module declarations to `apps/shell/src/remotes.d.ts`.
- [x] 3.4 Add routes `/checkout` and `/orders` in `apps/shell/src/App.tsx` wrapped in `RemoteBoundary` with authentication guard prompts.

## 4. Cart Integration & End-to-End Verification

- [x] 4.1 Update `apps/cart` store to listen for `cart:clear` events and connect the "Proceed to Checkout" button on `CartPage` to route to `/checkout`.
- [x] 4.2 Verify end-to-end integration: run all apps concurrently, perform login, add products to cart, complete checkout, verify cart clearing, and verify order appearance in "Pesanan Saya".
