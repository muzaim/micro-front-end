# Proposal

## Why

To learn and master Micro Frontend (MFE) architecture using React, Vite, and Module Federation, this change establishes a modular, decoupled e-commerce web platform. This setup provides hands-on practical experience in monorepo management, runtime remote integration, shared dependency management, and decoupled inter-app communication.

## What Changes

- Initialize a pnpm monorepo workspace for multi-app orchestration.
- Create shared libraries for types (`@mfe/shared-types`) and decoupled event communication (`@mfe/shared-events`).
- Establish `apps/shell` as the host application (port 3000) that renders the main layout, global navigation, and dynamically loads remote micro-apps with fallback error boundaries.
- Establish `apps/catalog` as a remote micro-app (port 3001) providing product listing and product detail views, capable of running standalone and exposing components via Vite Module Federation.
- Establish `apps/cart` as a remote micro-app (port 3002) providing shopping cart management, a mini-cart header badge, and a cart checkout summary page, communicating via an event-driven pub-sub bus.

## Capabilities

### New Capabilities
- `shell-navigation`: Provides root-level layout, remote route orchestration, and resilient error boundary fallback when remotes are unavailable.
- `catalog-browsing`: Provides product catalog display, product filtering/listing, product detail views, and emits add-to-cart events.
- `cart-management`: Provides cart item state management, mini-cart badge, full cart listing page, and listens for cart action events.

### Modified Capabilities
<!-- None: Greenfield project -->

## Impact

- **Architecture**: Transitions the empty repository into a pnpm monorepo structure with three React applications and two shared packages.
- **Dependencies**: Introduces React, React DOM, Vite, `@originjs/vite-plugin-federation`, TypeScript, and Tailwind CSS / CSS Modules.
- **Development Workflow**: Supports running all apps concurrently (`pnpm dev`) or working on individual remotes in isolation.
