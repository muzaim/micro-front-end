# Tasks

## 1. Cart Micro Frontend Updates

- [x] 1.1 Update `apps/cart/src/store/cartStore.ts` to resolve scoped storage keys with `getCartStorageKey(userId?: string)`, subscribe to `subscribeAuthStateChange`, and reload items reactively when user changes.
- [x] 1.2 Verify `apps/cart` build with `pnpm --filter cart build`.

## 2. Orders Micro Frontend Updates

- [x] 2.1 Update `apps/orders/src/store/orderStore.ts` to query and clear user-scoped cart storage using `getCartStorageKey(session?.user?.id)`.
- [x] 2.2 Verify `apps/orders` build with `pnpm --filter orders build`.

## 3. End-to-End Verification

- [x] 3.1 Verify full workspace build with `pnpm build`.
- [x] 3.2 Verify cart data isolation across User A, User B, and unauthenticated guest sessions in local storage.
