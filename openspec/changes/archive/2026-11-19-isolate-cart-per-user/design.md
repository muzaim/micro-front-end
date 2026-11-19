# Design

## Context

Currently, `apps/cart` uses a single static storage key (`mfe_ecommerce_cart`) and does not listen to authentication state changes. `apps/orders` also directly reads and clears this static key. See `proposal.md` for background and problem statement.

## Goals / Non-Goals

**Goals:**
- Provide strict user isolation for shopping cart items across different user accounts (`usr-001`, `usr-002`, `usr-003`) and unauthenticated guest sessions.
- Reactively switch cart contents and badge count when logging in, logging out, or switching accounts.
- Ensure `apps/orders` reads from and clears the active user's cart during checkout.

**Non-Goals:**
- Automatic cart merging between guest and authenticated users on login (strict isolation is explicitly desired).
- Server-side cart persistence or synchronization via remote API.

## Decisions

### Decision 1: Scoped Storage Key Resolution
- **Choice**: Cart storage keys will be resolved dynamically via a standardized naming scheme:
  ```ts
  export const getCartStorageKey = (userId?: string): string => {
    return userId ? `mfe_ecommerce_cart_${userId}` : 'mfe_ecommerce_cart_guest';
  };
  ```
- **Rationale**: Isolates data cleanly in `localStorage`. If User A adds items, logs out, and later logs back in, their items remain preserved in `mfe_ecommerce_cart_usr-001`, while User B starts with their own independent cart in `mfe_ecommerce_cart_usr-002`.
- **Alternatives Considered**:
  - Single object `{ [userId: string]: CartItem[] }`: More vulnerable to serialization corruption and harder to debug in browser DevTools.

### Decision 2: Reactive Auth State Subscription in CartStore
- **Choice**: `cartStore` will initialize its active user from `mfe_auth_session` in `localStorage` and subscribe to `subscribeAuthStateChange`.
- **Behavior**:
  - On receiving `session`: determine `userId = session?.user?.id`.
  - If `userId !== this.currentUserId`, update `this.currentUserId = userId`, reload items from `getCartStorageKey(this.currentUserId)`, and broadcast state changes via `this.notify()`.
- **Rationale**: Guarantees that `MiniCartBadge` and `CartPage` instantly reflect the active user's cart without requiring a manual page refresh.

### Decision 3: Harmonizing Cart Handling in OrderStore
- **Choice**: In `apps/orders/src/store/orderStore.ts`, update `getCartItems()` and `createOrder()` to use `getCartStorageKey(session?.user?.id)`.
- **Rationale**: Ensures the checkout page inspects the correct user's cart and removes only that user's cart upon order confirmation.

## Risks / Trade-offs

- **[Risk] Existing items in legacy `mfe_ecommerce_cart` key**  
  → *Mitigation*: Fall back to loading from `mfe_ecommerce_cart` if `mfe_ecommerce_cart_guest` is empty, or allow users to start fresh with isolated user keys.
