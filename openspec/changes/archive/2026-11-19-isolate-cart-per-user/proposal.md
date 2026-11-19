# Proposal

## Why

Currently, `apps/cart` stores cart items in a single un-scoped `localStorage` key (`mfe_ecommerce_cart`) and does not listen for `auth:state-change` events. Consequently, when User A adds items to their cart and logs out, and User B subsequently logs in, User B sees User A's cart items. 

Shopping carts must be strictly isolated per user account so each user only sees and modifies their own cart items, preserving data privacy and proper session separation.

## What Changes

- Scope shopping cart storage by user identity (`mfe_ecommerce_cart_<userId>` for authenticated users, and `mfe_ecommerce_cart_guest` for unauthenticated sessions).
- Subscribe `cartStore` to `auth:state-change` events so that logging in, logging out, or switching accounts reactively reloads the corresponding user's cart and triggers UI re-renders in `MiniCartBadge` and `CartPage`.
- Update `apps/orders/src/store/orderStore.ts` to read the active user's cart and clear only that active user's cart during checkout.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `cart-management`: Add user-scoped cart persistence and reactive session-switch synchronization so carts do not leak across distinct user accounts.

## Impact

- `apps/cart/src/store/cartStore.ts`: Dynamic storage key resolution based on active session (`mfe_auth_session`), subscription to `auth:state-change`, and reactive state reload.
- `apps/orders/src/store/orderStore.ts`: Dynamic cart storage key retrieval during `getCartItems()` and order checkout cleanup.
- Local storage schema: Keys transition from global `mfe_ecommerce_cart` to user-scoped `mfe_ecommerce_cart_<userId>` and `mfe_ecommerce_cart_guest`.
