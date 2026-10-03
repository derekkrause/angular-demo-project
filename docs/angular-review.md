# Angular application review and improvement plan

Reviewed on October 3, 2026 against the Angular CLI 22.0.7 bundled best-practices
resource and the official documentation linked below. This is a source review
with build, lint, and test checks, not a completed browser accessibility audit.
The application improvements below are a plan; only the environment/build setup
and its documentation were changed in this task.

## Current strengths

- Standalone components, signal inputs and queries, computed state, and `inject()`.
- Lazy feature routes and strict TypeScript/template checking.
- A functional HTTP interceptor that scopes URL rewriting to an explicit prefix.
- Separation between HTTP access, report state, and chart presentation.
- `NgOptimizedImage`, native template control flow, and Angular Material controls.
- ECharts imports through its modular API, initialization after rendering, and
  cleanup of both the chart and its resize observer.
- Router subscription cleanup with `takeUntilDestroyed()`.

Keep these foundations. A small portfolio app does not need a new state library
or server rendering simply to demonstrate good Angular practices.

## Environment configuration completed

| Command           | Configuration | Environment file                       |
| ----------------- | ------------- | -------------------------------------- |
| `pnpm start`      | Development   | `src/environments/environment.ts`      |
| `pnpm build`      | Development   | `src/environments/environment.ts`      |
| `pnpm watch`      | Development   | `src/environments/environment.ts`      |
| `pnpm build:prod` | Production    | `src/environments/environment.prod.ts` |
| `pnpm watch:prod` | Production    | `src/environments/environment.prod.ts` |

Production now uses an explicit Angular CLI file replacement. Previously the
production environment file was not selected by the build configuration.
Production optimization, output hashing, and budgets are preserved. Both files
currently point to the same public API, so their network destination is identical.
The existing GitHub Pages workflow already passes `--configuration production`.

This development default is appropriate for the requested demo workflow. Angular's
generated projects normally default builds to production; named configurations
and file replacements support either choice.
[Angular environment configuration](https://angular.dev/tools/cli/environments)

## Priority 1: Make the report safe and restore reliable verification

### Model asynchronous report states explicitly

Files: `products-report.service.ts`, `products-report.ts`, and
`products-report.html` under `src/app/features/widgets/products-report/`.

The resource starts with `{} as IResult`, which has neither `meta` nor `results`.
The component then calls `results.sort()` and the template reads
`productMeta().last_updated` before an HTTP response is available. Reading the
resource value after an error can also throw. The loading and error states are
hidden from the component.

Expose loading, error, available data, and reload behavior. Use an absent value
or a genuinely valid model instead of the cast. Guard data access, render distinct
loading/error/empty/success states, and add a retry action. Keep HTTP and resource
state in the existing service boundary.

Use `toSorted()` or copy before sorting: `sort()` currently mutates the resource's
response inside a computed derivation. Remove the console logging effect.
[Angular resource state guidance](https://angular.dev/guide/signals/resource)

Acceptance: delayed responses, empty results, failed requests, and retries render
without exceptions; deriving the top categories leaves the original response
unchanged. Test these behaviors with controlled HTTP responses.

### Repair the test suite, then replace weak assertions

The current suite cannot compile. Four service specs import from incorrect
relative paths, three feature specs use named imports for default exports, and
the bar-chart spec omits its generic type arguments.

After fixing compilation, supply required signal inputs, router/HTTP test
providers, and chart doubles where necessary. `ProductsReportService` is scoped
to its component and must be explicitly provided when tested directly. Replace
the starter app test expecting `Hello, angular-demo-project`. The interceptor
tests still expect all relative URLs to be rewritten, contrary to the current
`open-fda/` prefix contract.

Prioritize report state transitions, HTTP query parameters and prefix handling,
navigation behavior, theme persistence/system changes, and chart input updates.
Retain the useful chart resize and disposal tests already present.

Acceptance: the existing suite compiles and passes without real HTTP requests or
canvas initialization; meaningful tests cover the user-visible failure states.

### Make the documented lint command work

`ng lint` cannot resolve `@angular-eslint/builder:lint`. The builder exists as a
transitive dependency of `angular-eslint`, but pnpm does not expose it at the
workspace root. Add a matching direct development dependency on
`@angular-eslint/builder` and update the lockfile, then validate `pnpm lint`.
Direct execution of ESLint currently passes, so the observed failure is the
builder setup rather than lint violations.

Acceptance: `pnpm lint`, non-watch tests, formatting checks, and the production
build run in CI before the deployment job. The existing Pages workflow builds
but does not run those quality checks.

## Priority 2: Complete the interactions reviewers will encounter

### Finish navigation and responsive behavior

`ApplicationShell.isDesktop` stays true, the sidenav is permanently opened in
side mode, and the top-bar menu button has no handler. Use a breakpoint signal
or the CDK breakpoint observer to drive desktop/mobile behavior, and wire the
menu action to the drawer. Support dismissal and focus restoration on mobile.

Four visible navigation destinations have no implemented route. Either provide
an explicit planned-feature state or omit those entries until implemented. Give
the not-found page a clear missing-page message and a route back to the dashboard.
Check the top-bar GitHub link against the intended repository.

Acceptance: narrow-screen navigation opens and closes by mouse and keyboard;
visible destinations communicate their actual status.

### Make system theme selection reactive and resilient

`theme.service.ts` reads storage and system preference at module evaluation time.
It casts the stored string without validation and snapshots `matchMedia` once.
OS theme changes therefore do not update system mode during a session. Storage
access can also fail in restricted browser contexts.

Initialize browser state inside the service, validate stored values, safely fall
back when storage is unavailable, and listen to media-query changes with cleanup.
Keep internal writable signals private and expose readonly signals. Update the
theme toggle and chart theme dependencies to follow the effective theme.

Acceptance: system mode follows OS changes; explicit light/dark modes do not;
invalid or unavailable storage does not prevent startup. SSR support is optional
for this app and is not required by this recommendation.

### Verify accessibility beyond template lint

The chart has a useful outer accessible label, but its ECharts `aria`/decal options
are enabled without registering `AriaComponent` in `echarts.registry.ts`. Register
it if those features are intended. Offer an accessible data table or equivalent
structured text alongside the chart. Add route focus management, a skip link,
navigation labelling, and current-page semantics.

Check both themes and mobile layouts with axe plus keyboard and screen-reader
testing. Passing template accessibility lint alone does not demonstrate WCAG AA.
[Angular accessibility](https://angular.dev/best-practices/a11y),
[ECharts modular imports](https://echarts.apache.org/handbook/en/basics/import/),
[ECharts accessibility](https://echarts.apache.org/handbook/en/best-practices/aria/)

Acceptance: report states are announced appropriately; chart values are available
without interacting with canvas; all navigation is usable by keyboard.

## Priority 3: Polish architecture, performance, and presentation

- `BarChart` wraps its key inputs in `untracked()`. Changing a key while retaining
  the same data reference will not recompute options or its accessible summary.
  Track all configurable inputs and test changing them.
- `ChartThemeService.activeChartTheme` inserts/removes a DOM probe inside a
  computed derivation. Move DOM sampling to a render callback or controlled
  integration boundary and expose the sampled result as readonly state.
  Preserve the existing requirement to apply CSS before reading chart colors.
  [Angular render callbacks](https://angular.dev/guide/components/lifecycle)
- The image component keeps its old load/error state when `src` changes. Reset
  state for a new source and test recovery after a failed image.
- Prefer `protected readonly` for template-only bindings and readonly injected
  dependencies. Remove unused Material imports and the empty `DashboardService`.
  Remove redundant explicit OnPush metadata from the root component in line with
  the Angular 22 guide already supplied by the MCP server. Standardize test
  location and replace vague `IResult` naming with a domain-specific response type.
  [Angular style guide](https://angular.dev/style-guide)
- The production initial bundle is 576.67 kB against a 500 kB warning budget.
  Profile an Angular build with stats before changing imports; inspect Material
  imports and unused ECharts registrations. Keep lazy chart code and existing
  budgets. Do not raise the warning limit merely to hide the current warning.
- Update the README's claims about responsiveness and sample data to match the
  actual implementation. Clearly distinguish working features from planned
  features and explain the live FDA dependency. Consider an optional fixture
  mode so reviewers can explore the demo when the external API is unavailable.

Acceptance: configurable chart/image inputs update correctly, report derivations
remain pure, the README matches the app, and measured bundle improvements fit
the warning budget without sacrificing implemented behavior.

## Verification recorded for this review

- Locked dependency installation completed without changing `pnpm-lock.yaml`.
- Default development build: passed.
- Explicit production build: passed with the 76.67 kB initial-budget warning.
- Angular test target: failed at compilation with the defects listed above;
  runtime test results are therefore unavailable.
- Angular lint target: failed resolving its configured builder.
- Direct ESLint check of `src`: passed.
- Prettier checks of the changed JSON configuration files: passed.
- Browser interaction, contrast, screen-reader, and axe checks: not performed.

The MCP `run_target` tool also failed with `spawn ng ENOENT`; verification used
the installed local CLI directly. Initial Windows sandbox filesystem failures
were resolved by rerunning build/test commands outside the sandbox. Those access
errors are distinct from the application defects reported here.
