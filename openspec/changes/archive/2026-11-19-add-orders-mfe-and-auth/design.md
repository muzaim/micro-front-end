# Design

## Context

The repository is a pnpm monorepo consisting of:
- `apps/shell`: Host container on port 3000 running React and `@originjs/vite-plugin-federation`.
- `apps/catalog`: Remote micro frontend on port 3001 exposing product browsing.
- `apps/cart`: Remote micro frontend on port 3002 exposing cart badge and cart page.
- `packages/shared-types` and `packages/shared-events`: Shared domain contracts and custom event pub/sub.

See `proposal.md` for background and motivation.

## Goals / Non-Goals

**Goals:**
- Create a new remote micro frontend `apps/orders` running on port 3003 with Module Federation.
- Expose `CheckoutPage` and `OrdersPage` from `apps/orders` to be consumed by `apps/shell`.
- Implement simulated authentication in `apps/shell` with hardcoded credentials (`user@mfe.com` / `password123`) and session persistence.
- Enable cross-MFE token consumption: `apps/orders` reads the auth session from `localStorage` (`mfe_auth_session`) to authorize checkout and query user orders.
- Use `localStorage` as a mock client-side database for orders (`mfe_ecommerce_orders`).
- Clear cart items on successful order completion via event `cart:clear`.

**Non-Goals:**
- Building a real backend authentication server, JWT signing service, or remote database.
- Integrating real external payment gateways (e.g. Midtrans, Stripe) or real logistics APIs.
- Multi-user concurrent session simulation across multiple devices.

## Decisions

### Decision 1: Host-Governed Authentication in `apps/shell`
- **Choice**: Implement login modal and session lifecycle management directly in the shell application.
- **Rationale**: The shell owns the header layout, global routing, and route access guards. Managing authentication state at the host level avoids deploying a standalone MFE for a single login form while reflecting real-world host-governed session architectures.
- **Alternatives Considered**:
  - *Standalone `apps/auth` MFE*: Adds significant runtime and configuration overhead (port, bundler, federation) for a simple dummy login form.
  - *Auth inside `apps/orders`*: Scopes auth too narrowly, preventing the shell header and other future remotes from cleanly checking user status.

### Decision 2: Dedicated Remote `apps/orders` (Port 3003)
- **Choice**: Scaffold `apps/orders` with Vite and `@originjs/vite-plugin-federation` on port 3003, exposing `./CheckoutPage` and `./OrdersPage`.
- **Rationale**: Isolates the purchase and post-purchase domain from cart and catalog, demonstrating multi-remote composition in the host shell.
- **Alternatives Considered**:
  - *Bundling checkout into `apps/cart`*: Feasible, but misses the opportunity to demonstrate cross-MFE integration across three distinct remotes and multi-remote routing in `apps/shell`.

### Decision 3: Shared Browser Storage Contract as Mock Database
- **Choice**: Formalize three `localStorage` keys under the host origin (`localhost:3000`):
  - `mfe_auth_session`: Holds `{ token: string, user: AuthUser, expiresAt: number }`.
  - `mfe_ecommerce_cart`: Holds `CartItem[]` (managed by `apps/cart`).
  - `mfe_ecommerce_orders`: Holds `Order[]` (managed by `apps/orders`).
- **Rationale**: Under client-side Module Federation, all remotes run within the origin of `apps/shell` (`http://localhost:3000`). LocalStorage acts as an instant, zero-latency shared persistence layer.
- **Alternatives Considered**:
  - *In-memory state only*: Orders and login would disappear on page refresh.

### Decision 4: Event-Driven Coordination for Post-Order Actions
- **Choice**: When checkout completes in `apps/orders`, dispatch a `cart:clear` event via `packages/shared-events`. `apps/cart` listens and empties `cartStore`.
- **Rationale**: Keeps `apps/orders` and `apps/cart` loosely coupled without direct code dependencies.

## Risks / Trade-offs

- **[Risk] Direct access to `/checkout` when not logged in**  
  → *Mitigation*: Both the shell wrapper and `CheckoutPage` component will inspect the auth session. If invalid, the shell renders an authentication prompt/modal before allowing checkout form interaction.
- **[Risk] Port 3003 conflict**  
  → *Mitigation*: Configure strict port 3003 in `apps/orders/vite.config.ts`, align `dev` scripts in root `package.json`, and ensure CORS is enabled.
- **[Risk] Storage corruption in LocalStorage**  
  → *Mitigation*: Wrap JSON parse calls with try/catch and fallback defaults in `orderStore` and `authStore`.
