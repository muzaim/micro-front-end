# Design

## Context

Authentication is managed at the host level in `apps/shell/src/auth/authStore.ts`. Currently, it only validates a single hardcoded credential object (`user@mfe.com` / `password123`).

See `proposal.md` for motivation and requirements.

## Goals / Non-Goals

**Goals:**
- Provide 3 distinct user accounts with distinct `userId`s (`usr-001`, `usr-002`, `usr-003`) and distinct mock tokens.
- Add quick-select buttons in `LoginModal.tsx` to prefill credentials in one click.
- Maintain backward compatibility for `user@mfe.com`.
- Update hint boxes in `apps/orders/src/components/CheckoutPage.tsx` and `OrdersPage.tsx`.

**Non-Goals:**
- Connecting to an external authentication database or user registration service.

## Decisions

### Decision 1: `DUMMY_USERS` Array in `authStore.ts`
- **Choice**: Replace single `DUMMY_CREDENTIALS` with a structured list `DUMMY_USERS`:
  ```ts
  export interface DummyAccount {
    email: string;
    aliasEmail?: string;
    password: string;
    user: AuthUser;
    token: string;
  }
  ```
- **Accounts**:
  1. `usr-001`: Budi Santoso (`budi@mfe.com` and `user@mfe.com`)
  2. `usr-002`: Siti Rahma (`siti@mfe.com`)
  3. `usr-003`: Andi Pratama (`andi@mfe.com`)
- **Rationale**: An array allows easy iteration in UI components (like quick-fill buttons) and lookup during login authentication.

### Decision 2: 1-Click Quick Fill in `LoginModal.tsx`
- **Choice**: Render an account selector chip/button bar in `LoginModal.tsx` displaying each user's name and role tag. Clicking a chip sets `email` and `password` state immediately.
- **Rationale**: Drastically speeds up switching between users during testing without manual typing.

## Risks / Trade-offs

- **[Risk] Existing session in LocalStorage**  
  → *Mitigation*: Existing sessions stored under `mfe_auth_session` continue to work. Logging out cleanly clears `mfe_auth_session` and switching accounts switches the active `userId`.
