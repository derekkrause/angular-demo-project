# Testing user interactions and outcomes

The application uses Vitest through Angular's `@angular/build:unit-test` builder.
`angular.json` explicitly selects `runner: "vitest"`, and `tsconfig.spec.json`
loads `vitest/globals`. Tests use Vitest assertions and `vi` mocks, not Jest or
Jasmine. Angular's `TestBed` is a framework testing utility, not a competing runner.
[Angular testing documentation](https://angular.dev/guide/testing)

Run once with `pnpm test:run`, or use `pnpm test` while developing. The Pages
workflow runs the suite before building/deploying. No percentage threshold is
used: the following behavior contracts define the useful coverage.

## Automated behavior contracts

| User outcome               | What the tests verify                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open the application       | The home URL redirects to Dashboard, the shell displays the report, and the page/toolbar titles agree.                                                                                          |
| Select Reports             | Clicking the actual navigation link changes route, active navigation styling, document title, and routed content.                                                                               |
| Open an unknown URL        | The real route configuration redirects to and renders the not-found page.                                                                                                                       |
| Request report data        | The API service requests industry-category counts; the interceptor scopes rewriting to the FDA prefix and leaves assets/other URLs intact. Failures propagate to the report.                    |
| Wait for the report        | A Material spinner appears; metadata and chart are absent until the request completes.                                                                                                          |
| Receive report data        | The spinner disappears, the last-updated date appears, and the chart receives sorted category/count data. Only the ten highest counts are included and the original response remains unchanged. |
| Receive no results         | An explicit empty state appears instead of a chart.                                                                                                                                             |
| Recover from an error      | The inline alert appears; clicking Retry starts another request and spinner, then successfully restores the chart. Reading failed resource data safely returns undefined.                       |
| Select a theme             | Clicking the real Material menu options changes persisted preferences and dark/light body styling. System selection restores the browser preference and theme-appropriate GitHub icons.         |
| View an image              | Loading, successful load, and failed load have distinct visible outcomes, and the supplied image description is retained.                                                                       |
| Receive updated chart data | Category labels, counts, and the accessible chart description change to match the new data.                                                                                                     |
| Change chart colors        | A changed theme updates the colors passed to the chart renderer.                                                                                                                                |
| Resize or leave a chart    | The wrapper resizes the chart and cleans up its observer/renderer on destruction. Updating options reaches the renderer and updates the accessible description.                                 |

These contracts are covered by component interactions, real Angular routing,
controlled HTTP requests, and integration-boundary doubles. Chart initialization
has an injectable factory so TestBed can substitute the native renderer without
mocking immutable ES-module exports. The actual ECharts rendering library is not
reimplemented by these tests.

## Remaining browser checks and planned behavior

The suite passes in jsdom. It does not establish pixel layout, native canvas
rendering, responsive behavior, contrast, focus restoration, keyboard menu
navigation, or screen-reader usability. Those need browser tests and an
accessibility audit; automated template checks alone are insufficient.

The review also identified existing behavior that needs implementation work
before its intended outcome can be locked down with passing regression tests:

- The shell menu button has no action, and mobile drawer behavior is unfinished.
- Several navigation destinations are planned rather than implemented.
- System theme preference is sampled once; live OS changes do not update it.
- Theme preference restoration is tied to module initialization. Invalid storage
  values and unavailable storage still need resilient handling and tests.
- The image component does not reset after its `src` changes following a failure.
- Chart key inputs are read with `untracked`, so changing only those keys does
  not recompute the chart configuration.

Do not write tests that enshrine those defects as desired behavior. Add regression
tests with each repair. Basic creation tests remain as wiring checks, but they
are not the evidence used to judge behavioral coverage.

## Review result

On October 4, 2026, the complete Vitest suite passed without excluding specs or
using a temporary test configuration. Broken imports, missing input/provider
setup, stale starter assertions, the old interceptor contract, and incompatible
chart mocks were repaired. No live HTTP or native canvas is needed by the suite.

The currently implemented report, navigation, theme-selection, image-state, and
chart-update outcomes have useful automated regression protection. The browser
and unfinished-feature gaps above remain explicit rather than being hidden by
line-coverage numbers.
