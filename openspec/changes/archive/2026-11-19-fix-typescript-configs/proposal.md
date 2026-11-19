# Proposal

## Why

In Visual Studio Code and other IDEs, `packages/shared-events/tsconfig.json` and `packages/shared-types/tsconfig.json` display red squiggly errors on `outDir` because `dist` output directories are not excluded and explicit `rootDir` paths are missing. Furthermore, `apps/*/tsconfig.json` omit `vite.config.ts` from their file inclusions and use legacy module resolution, and the repository root lacks a root `tsconfig.json` for monorepo project references. This change fixes all TypeScript configurations across the workspace to eliminate editor diagnostics errors and align with modern Vite 5 TypeScript standards.

## What Changes

- Add a root `tsconfig.json` referencing all workspace packages (`@mfe/shared-types`, `@mfe/shared-events`) and applications (`shell`, `catalog`, `cart`, `orders`).
- Update `packages/shared-events/tsconfig.json` with explicit `"rootDir": "./src"`, `"exclude": ["dist", "node_modules"]`, and `"lib": ["DOM", "DOM.Iterable", "ES2022"]`.
- Update `packages/shared-types/tsconfig.json` with explicit `"rootDir": "./src"`, `"exclude": ["dist", "node_modules"]`, and `"lib": ["ES2022"]`.
- Update `apps/shell/tsconfig.json`, `apps/catalog/tsconfig.json`, `apps/cart/tsconfig.json`, and `apps/orders/tsconfig.json` to include `"vite.config.ts"`, set `"moduleResolution": "bundler"`, and add `"exclude": ["dist", "node_modules"]`.

## Capabilities

### New Capabilities
<!-- No new runtime capabilities (tooling & developer experience refactor with skip_specs: true) -->

### Modified Capabilities
<!-- No behavioral spec changes -->

## Impact

- **Developer Experience**: Eliminates false positive red underlines on `outDir`, `tsconfig.json` files, and `vite.config.ts` across the entire workspace in VS Code.
- **Build & Compilation**: Preserves existing build pipelines with zero runtime changes to application behavior.
