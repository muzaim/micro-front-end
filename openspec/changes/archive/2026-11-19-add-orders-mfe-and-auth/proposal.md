# Proposal

## Why

To demonstrate cross-micro-frontend authentication and transaction workflows, the platform requires user authentication, a simulated checkout process, and order history tracking. By introducing a dedicated `orders` micro frontend alongside authentication managed at the shell host, this change verifies how auth tokens and transactional state can be seamlessly shared across decoupled remotes and persisted in browser storage.

## What Changes

- Add a new remote micro frontend `apps/orders` (running on port 3003) exposing `CheckoutPage` and `OrdersPage`.
- Introduce user authentication managed by `apps/shell` with hardcoded dummy credentials (`user@mfe.com` / `password123`), persisting session and mock JWT token in `localStorage`.
- Integrate `apps/orders` into `apps/shell` via Module Federation, mounting `/checkout` and `/orders` routes with remote boundaries and route guards.
- Implement checkout workflow in `apps/orders` requiring an active auth token, capturing shipping address and payment method, generating order IDs, clearing cart, and persisting orders to `localStorage` (`mfe_ecommerce_orders`).
- Implement "Pesanan Saya" (Order History) in `apps/orders` displaying past orders associated with the logged-in user.
- Update `apps/cart` to connect "Proceed to Checkout" to the checkout route/flow.
- Extend `packages/shared-types` with `AuthUser`, `AuthSession`, `Order`, `PaymentMethod`, and `ShippingAddress`.
- Extend `packages/shared-events` with authentication events (`auth:state-change`) and order events (`order:created`, `cart:clear`).

## Capabilities

### New Capabilities
- `user-authentication`: Manages user login with predefined credentials, session storage in `localStorage`, session validation, and auth state change event broadcasting.
- `order-processing`: Manages checkout submission (address, payment method, validation of auth session), order persistence into `localStorage`, cart clearance upon successful purchase, and viewing user-specific order history.

### Modified Capabilities
- `shell-navigation`: Extends host routing to support `/checkout` and `/orders`, incorporates auth state controls (Login modal/trigger, user profile display, logout) in the header navigation, and provides links to "Pesanan Saya".
- `cart-management`: Integrates cart checkout action with user authentication checks and routing to `/checkout`, and adds listeners to clear cart when an order is completed.

## Impact

- **New App**: `apps/orders` Vite React project with `@originjs/vite-plugin-federation` on port 3003.
- **Root Configuration**: `package.json` and `pnpm-workspace.yaml` scripts updated to build and run `orders` concurrently.
- **Host App (`apps/shell`)**: Vite federation remotes list updated with `orders`, routes added for `/checkout` and `/orders`, header UI updated with auth controls.
- **Shared Packages**: `packages/shared-types` and `packages/shared-events` expanded with auth and order models/events.
- **Storage Contract**: LocalStorage keys `mfe_auth_session`, `mfe_ecommerce_cart`, and `mfe_ecommerce_orders` formalized as shared browser storage schemas.
