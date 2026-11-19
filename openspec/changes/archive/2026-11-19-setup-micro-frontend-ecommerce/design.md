# Design

## Context

The repository is currently greenfield. To provide an optimal learning environment for React Micro Frontend architecture, we design a modular monorepo structure. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Establish a pnpm monorepo workspace organizing apps (`shell`, `catalog`, `cart`) and shared packages (`shared-types`, `shared-events`).
- Configure Vite Module Federation (`@originjs/vite-plugin-federation`) to expose components dynamically across ports (Shell: 3000, Catalog: 3001, Cart: 3002).
- Ensure `react` and `react-dom` are loaded as shared singletons to prevent multiple React instances in runtime.
- Implement decoupled inter-app communication using TypeScript-typed Custom Events on the window object.
- Support standalone execution for `catalog` and `cart` so developers can build and test remotes in isolation.
- Provide React Error Boundaries in the Shell to gracefully handle remote load failures.

**Non-Goals:**
- Real backend API or database integration (mock JSON/in-memory data will be used).
- Authentication, payment gateway processing, or production cloud deployments.
- Server-side rendering (SSR) or streaming architecture (focus is client-side federation).

## Decisions

### 1. Vite with `@originjs/vite-plugin-federation` over Webpack 5
- **Decision**: Use Vite with `@originjs/vite-plugin-federation`.
- **Rationale**: Vite provides instant dev server startup and fast HMR. For a learning project, the fast feedback loop keeps development engaging without heavy Webpack boilerplate.
- **Alternatives Considered**: Webpack 5 Module Federation (more mature for production federated ecosystems, but significantly slower build and configuration overhead).

### 2. Monorepo (pnpm workspaces) over Multi-repo
- **Decision**: Organize the project into a single Git repository with pnpm workspaces.
- **Rationale**: Simplifies running all micro-apps simultaneously via a single `pnpm dev` command and enables shared local packages (`@mfe/shared-types`, `@mfe/shared-events`) without publishing to an npm registry.
- **Alternatives Considered**: Separate Git repos per micro-app (closer to real-world organizational boundaries, but excessive operational friction for local learning).

### 3. Window Custom Events over Shared Runtime Store
- **Decision**: Use Custom Events (`window.dispatchEvent` / `window.addEventListener`) wrapped in typed helpers (`@mfe/shared-events`).
- **Rationale**: True decoupling. The catalog application does not need to know whether the cart is using Redux, Zustand, or React Context; it only dispatches an event when an item is added.
- **Alternatives Considered**: Shared Zustand store across Module Federation (clean state API, but introduces tighter coupling between remotes).

### 4. Shared Dependencies Strategy
- **Decision**: Define `react` and `react-dom` as `shared: ['react', 'react-dom']` in all federation plugins.
- **Rationale**: Guarantees React hooks and contexts behave properly by sharing the single React instance loaded by the Shell host.

## Risks / Trade-offs

- **[Vite Federation Dev Mode Nuance]** → Vite's native dev server serves unbundled ES modules, while `@originjs/vite-plugin-federation` generates chunks during build.
  *Mitigation*: Provide npm scripts that build remotes and preview them, or configure the plugin with appropriate dev targets (`target: 'esnext'`).
- **[CSS Style Collision]** → Global CSS rules from one remote could affect another.
  *Mitigation*: Use Tailwind CSS or scoped CSS modules with consistent class naming conventions.
- **[Remote Failure Cascading]** → If Catalog or Cart server is down, Shell could crash on import.
  *Mitigation*: Wrap React.lazy dynamic imports inside a reusable `RemoteBoundary` component with fallback UI.
