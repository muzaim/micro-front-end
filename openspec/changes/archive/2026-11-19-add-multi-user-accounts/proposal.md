# Proposal

## Why

To thoroughly test data isolation and user-specific order filtering across the micro frontend ecosystem, the platform requires multiple distinct user identities. By expanding from a single dummy account to three predefined accounts with one-click autofill in the login interface, developers can switch users to verify that orders and sessions are scoped strictly to the authenticated `userId`.

## What Changes

- Expand dummy authentication credentials in `apps/shell/src/auth/authStore.ts` from 1 account to 3 predefined user accounts:
  - User A: Budi Santoso (`budi@mfe.com` / alias `user@mfe.com`, `password123`, ID: `usr-001`)
  - User B: Siti Rahma (`siti@mfe.com`, `password123`, ID: `usr-002`)
  - User C: Andi Pratama (`andi@mfe.com`, `password123`, ID: `usr-003`)
- Add 1-click quick-select profile buttons in `apps/shell/src/components/LoginModal.tsx` for fast account switching during testing.
- Update login prompt hints in `apps/orders/src/components/CheckoutPage.tsx` and `OrdersPage.tsx` to list the 3 available test accounts.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `user-authentication`: Updates `User Login with Predefined Credentials` requirement to validate any of the three predefined dummy accounts.

## Impact

- **Shell Auth (`apps/shell`)**: Multiple credential validation in `authStore.ts` and enhanced UI buttons in `LoginModal.tsx`.
- **Orders MFE (`apps/orders`)**: Updated credential documentation hints in `CheckoutPage.tsx` and `OrdersPage.tsx`.
