# Tasks

## 1. Shared Packages Configuration

- [x] 1.1 Update `packages/shared-events/tsconfig.json` with explicit `rootDir`, `exclude`, and `lib`, and verify with `pnpm --filter @mfe/shared-events build`.
- [x] 1.2 Update `packages/shared-types/tsconfig.json` with explicit `rootDir`, `exclude`, and `lib`, and verify with `pnpm --filter @mfe/shared-types build`.

## 2. Micro Frontend Apps Configuration

- [x] 2.1 Update `apps/shell/tsconfig.json` to include `vite.config.ts`, configure `moduleResolution: "bundler"`, and exclude `dist` and `node_modules`, verifying with `pnpm --filter shell build`.
- [x] 2.2 Update `apps/catalog/tsconfig.json` to include `vite.config.ts`, configure `moduleResolution: "bundler"`, and exclude `dist` and `node_modules`, verifying with `pnpm --filter catalog build`.
- [x] 2.3 Update `apps/cart/tsconfig.json` to include `vite.config.ts`, configure `moduleResolution: "bundler"`, and exclude `dist` and `node_modules`, verifying with `pnpm --filter cart build`.
- [x] 2.4 Update `apps/orders/tsconfig.json` to include `vite.config.ts`, configure `moduleResolution: "bundler"`, and exclude `dist` and `node_modules`, verifying with `pnpm --filter orders build`.

## 3. Workspace Root Setup & Verification

- [x] 3.1 Create root `tsconfig.json` with project references to all workspace packages and apps.
- [x] 3.2 Verify complete workspace type check and builds across all packages with `pnpm build`.
