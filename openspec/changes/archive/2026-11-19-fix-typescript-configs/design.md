# Design

## Context

The repository is structured as a pnpm monorepo with 4 apps (`apps/shell`, `apps/catalog`, `apps/cart`, `apps/orders`) and 2 shared library packages (`packages/shared-types`, `packages/shared-events`).

Currently, developers opening the workspace in VS Code see red errors on `outDir` in `tsconfig.json` and when opening `vite.config.ts`. See `proposal.md` for problem background.

## Goals / Non-Goals

**Goals:**
- Provide clear, error-free TypeScript configuration across the workspace in IDEs.
- Isolate compiled `dist/` directories from TypeScript input scanning using explicit `rootDir` and `exclude`.
- Include `vite.config.ts` in app tsconfig files to eliminate orphan file warnings.
- Modernize Vite app module resolution to `"moduleResolution": "bundler"`.
- Establish a root `tsconfig.json` linking workspace sub-projects.

**Non-Goals:**
- Modifying runtime business logic, event signatures, or data types.
- Introducing a root-level build bundler.

## Decisions

### Decision 1: Root `tsconfig.json` with Project References
- **Choice**: Create a root `tsconfig.json` using `"files": []` and `"references": [...]` pointing to each package and app folder.
- **Rationale**: When VS Code opens a monorepo workspace at the root, the TypeScript language server looks for a root `tsconfig.json`. Defining project references enables VS Code to correctly map files to their respective subproject configurations rather than falling back to an unconfigured inferred project.

### Decision 2: Explicit `rootDir` and `exclude` in Library Packages
- **Choice**: In `packages/shared-events/tsconfig.json` and `packages/shared-types/tsconfig.json`, explicitly set:
  - `"rootDir": "./src"`
  - `"exclude": ["dist", "node_modules"]`
  - Explicit `"lib"` (`["DOM", "DOM.Iterable", "ES2022"]` for `shared-events`, `["ES2022"]` for `shared-types`).
- **Rationale**: Prevents TypeScript from considering `./dist` as an input source and fixes the `"Cannot write file ... because it would overwrite input file"` error flagged on `outDir`.

### Decision 3: Standardize Vite App Configs to `"moduleResolution": "bundler"`
- **Choice**: In `apps/shell`, `apps/catalog`, `apps/cart`, and `apps/orders`, update `tsconfig.json` to:
  - `"moduleResolution": "bundler"`
  - `"include": ["src", "vite.config.ts"]`
  - `"exclude": ["dist", "node_modules"]`
- **Rationale**: Vite 5 uses ES modules and bundler resolution natively. `"bundler"` resolution allows resolving package exports cleanly and including `vite.config.ts` prevents IDE warnings when opening configuration files.

## Risks / Trade-offs

- **[Risk] Project references build requirement (`tsc -b`)**  
  → *Mitigation*: The root build scripts in `package.json` use `pnpm --filter` which invokes each package's own `tsc` command directly, so individual builds remain completely unaffected while IDE navigation improves.
