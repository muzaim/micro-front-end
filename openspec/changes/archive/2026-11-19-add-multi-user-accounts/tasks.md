# Tasks

## 1. Shell Auth Store & Multi-User Support

- [x] 1.1 Update `apps/shell/src/auth/authStore.ts` to export `DUMMY_USERS` containing Budi Santoso (`usr-001`), Siti Rahma (`usr-002`), and Andi Pratama (`usr-003`), updating login validation to check all accounts.
- [x] 1.2 Update `apps/shell/src/components/LoginModal.tsx` to add quick-select profile chips for 1-click credential autofill and verify build with `pnpm --filter shell build`.

## 2. Orders Micro Frontend Hint Updates

- [x] 2.1 Update `apps/orders/src/components/CheckoutPage.tsx` and `OrdersPage.tsx` login prompt cards to list all 3 test accounts, and verify build with `pnpm --filter orders build`.

## 3. End-to-End Verification

- [x] 3.1 Verify complete workspace build with `pnpm build` and verify multi-user isolation across accounts in local storage.
