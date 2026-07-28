# Angular Demo Project

An evolving Angular demonstration application for experimenting with modern Angular patterns, Angular Material, theming, and data visualization.

The application currently provides a responsive dashboard shell with navigation, light, dark, and system theme options, and an accessible ECharts horizontal bar chart displaying sample product-category data. The dashboard and not-found pages are loaded lazily through the Angular router.

You can test out the demo here: https://derekkrause.github.io/angular-demo-project/dashboard

## Architecture Decisions
- Angular v22
- Standalone Architecture
- Signals-first state management
- Native Angular APIs / minimal third-party packages
- Smart/presentational component boundaries
- API services separated from application state
- Testing Strategy
- ECharts isolated behind application-owned components with
  bundle size minimized using the tree-shakeable interface
- Upgradeability as an explicit architectural requirement

## Technology

- Angular 22.0.7
- Angular CLI and build tooling 22.0.7
- Angular Material and CDK 22.0.5
- TypeScript 6.0.3
- Apache ECharts 6.1.0
- RxJS 7.8.2
- Vitest 4.1.10
- pnpm 11.15.1

The authoritative dependency declarations are in [`package.json`](./package.json), with exact resolved versions recorded in [`pnpm-lock.yaml`](./pnpm-lock.yaml).

## Getting started

This project uses pnpm 11.15.1. With pnpm installed globally, install dependencies with:

```bash
pnpm install
```

Start the local development server with:

```bash
pnpm start
```

The development server opens the application at `http://localhost:4200/` and reloads when source files change.

## Development commands

Run a production build:

```bash
pnpm build
```

Run unit tests:

```bash
pnpm test
```

Run lint checks:

```bash
pnpm lint
```

Check formatting:

```bash
pnpm format:check
```

Generate an Angular artifact:

```bash
pnpm ng generate component component-name
```

For the available schematics and options, run `pnpm ng generate --help`.

## Additional resources

See the [Angular CLI documentation](https://angular.dev/tools/cli) for complete command guidance.
