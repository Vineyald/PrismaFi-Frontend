# PrismaFi Frontend

The PrismaFi web application, built with Angular and TypeScript. PrismaFi will centralize financial accounts, bills, bank connections, transactions and payments in one authenticated web app. This repository is currently the foundation: an app shell, a design-system base, a lazy-loaded startup screen that shows live backend status, and a test setup. There are no product features yet.

The backend lives in a separate repository (`PrismaFi-Backend`). The two integrate only through REST and the backend's OpenAPI schema, and this repo never imports backend files.

## Technology Stack

| Technology                                 | Why it is here                                                                                                              | Status                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Angular 22**                             | Application framework: standalone components, Signals, router, HttpClient. Zoneless by default.                             | installed                                       |
| **TypeScript 6** (strict)                  | Type safety end to end, including types generated from the backend's OpenAPI schema. `strict` and `strictTemplates` are on. | installed                                       |
| **SCSS**                                   | The custom PrismaFi design system: compile-time tokens plus CSS custom properties for runtime theming.                      | installed                                       |
| **Signals**                                | Local and shared state, through `signal`, `computed` and `httpResource`. There is no NgRx and no BehaviorSubject stores.    | in use                                          |
| **Vitest**                                 | Unit and component tests, through Angular's `@angular/build:unit-test` builder with jsdom.                                  | installed                                       |
| **Playwright**                             | End-to-end tests in a real browser (the installed Google Chrome).                                                           | installed                                       |
| **ESLint** (angular-eslint) + **Prettier** | Linting, including template accessibility rules, plus formatting.                                                           | installed                                       |
| **Angular CDK**                            | Behavior and accessibility primitives (overlays, focus traps, a11y) under PrismaFi's own visuals.                           | planned: install with the first overlay or menu |
| **Lucide**                                 | Icon set.                                                                                                                   | planned: install with the first icon            |
| **Apache ECharts**                         | Financial charts.                                                                                                           | planned: install with the first chart           |

Planned packages are not installed until a component needs them. This follows the project rule against unused dependencies.

## Architecture

```text
PrismaFi-Frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── api/
│   │   │       └── schema.d.ts      # GENERATED from backend OpenAPI (npm run api:types)
│   │   ├── features/
│   │   │   └── home/                # Startup screen (lazy-loaded route)
│   │   │       ├── home.ts / .html / .scss
│   │   │       └── home.spec.ts
│   │   ├── app.ts / app.scss        # App shell: header + <router-outlet>
│   │   ├── app.routes.ts            # Lazy routes
│   │   └── app.config.ts            # Providers: router, HttpClient (fetch)
│   ├── styles/
│   │   ├── _tokens.scss             # Compile-time tokens: spacing, radii, type, breakpoints
│   │   ├── _themes.scss             # Runtime theme: --prisma-* custom properties, light + dark
│   │   ├── _mixins.scss             # `from($bp)` mobile-first media query
│   │   └── _reset.scss              # Minimal modern reset
│   ├── styles.scss                  # Global entry: reset, themes, base body styles
│   ├── index.html
│   └── main.ts
├── e2e/
│   └── app.spec.ts                  # Playwright tests
├── public/favicon.svg
├── proxy.conf.json                  # Dev proxy: /api -> http://localhost:8000
├── playwright.config.ts
├── eslint.config.js
└── angular.json
```

| Folder             | Responsibility                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `core/`            | App-wide, non-visual infrastructure. Today that is the generated API contract. Functional interceptors (e.g. auth) and guards go here when authentication arrives. |
| `features/<name>/` | One folder per product area, each with its own lazy route, components, styles and specs. A feature never imports another feature's internals.                      |
| `styles/`          | The design system's global layer.                                                                                                                                  |
| `app.ts`           | The shell. It moves to its own `layout/` folder only when there are several layouts (e.g. public vs authenticated).                                                |

`shared/` and `layout/` are **deliberately not created yet**. `shared/` appears when a second feature reuses a component.

## Angular Patterns

| Convention            | Rule                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standalone            | Components only, no NgModules. The `standalone: true` flag is implicit.                                                                                                            |
| Signals               | `signal()` for state and `computed()` for derived values. `effect()` only for real side effects such as DOM or storage sync.                                                       |
| Data fetching         | `httpResource()` for reads: signal-based, with no manual subscriptions. HttpClient Observables only for mutations or streaming.                                                    |
| Control flow          | `@if`, `@for`, `@switch`. No structural directives.                                                                                                                                |
| DI                    | `inject()`, not constructor injection.                                                                                                                                             |
| Routes                | Every feature is lazy-loaded with `loadComponent` or `loadChildren`.                                                                                                               |
| Guards / interceptors | Functional only (`CanActivateFn`, `HttpInterceptorFn`), registered through `provideRouter` and `provideHttpClient(withInterceptors(...))`. None exist yet, since there is no auth. |
| Forms                 | Typed Reactive Forms (`FormControl<T>`, `NonNullableFormBuilder`). `@angular/forms` is added with the first form.                                                                  |
| API types             | Always from `core/api/schema.d.ts`. Never hand-write backend shapes.                                                                                                               |

## Styling

PrismaFi has its own visual identity. It **does not use Tailwind, Bootstrap, DaisyUI or Angular Material** as its design system.

- **Tokens (`_tokens.scss`)** are SCSS variables for values fixed at build time: the spacing scale (`$space-*`), radii, font stack, type scale, weights, line-heights and breakpoints. Components load them with `@use 'tokens' as *;` (`src/styles` is on the SCSS include path). A token is added when a component first needs it, and Sass fails on undefined variables.
- **Themes (`_themes.scss`)** are CSS custom properties for anything that changes at runtime: `--prisma-bg`, `--prisma-surface`, `--prisma-border`, `--prisma-text`, `--prisma-text-muted`, `--prisma-accent`, `--prisma-accent-2`, `--prisma-positive`, `--prisma-warning`, `--prisma-danger`, `--prisma-shadow` and `--prisma-gradient-brand`. Light is the default, and dark follows `prefers-color-scheme`. A manual theme toggle can later override the same properties via `[data-theme]`.
- **Component styles** live next to their component (`*.scss`, emulated encapsulation). They use tokens and `var(--prisma-*)`, not hard-coded colors or spacing. Global styles stay limited to reset, theme and base typography.
- **Responsive**: mobile-first, using `@include from($bp-md) { ... }`.
- **Accessibility**: the global `:focus-visible` ring, `prefers-reduced-motion` respected in the reset, text contrast of at least 3:1 for large text and 4.5:1 for body text, and the ESLint template accessibility rules.

## Setup

Prerequisites: Node 24 and npm 11. Google Chrome is needed for the E2E tests. Use the backend for live data.

```bash
# 1. Clone
git clone <repo-url> PrismaFi-Frontend
cd PrismaFi-Frontend

# 2. Install dependencies
npm install

# 3. Configure environment: nothing to configure.
#    The app calls the API with relative /api URLs; the dev proxy forwards them.

# 4. Start the dev server: http://localhost:4200
npm start

# 5. Production build: output in dist/PrismaFi-Frontend/browser
npm run build

# 6. Unit tests (Vitest)
npm test

# 7. E2E tests (Playwright; starts the dev server itself, backend not needed)
npm run e2e

# Lint and formatting
npm run lint
npm run format:check
```

Without the backend running, the app still works. The startup screen shows **API offline**.

## Backend Integration

```text
Angular (localhost:4200) --REST /api/*--> Angular dev proxy --> FastAPI (localhost:8000)
```

- **No hard-coded API hosts.** All calls use relative paths (`/api/...`). In development the Angular proxy forwards them. In production the same origin serves the app and forwards `/api` to the backend through a reverse proxy. This avoids CORS entirely and needs no `environment.ts` files. If the API ever needs a different origin, introduce a single API base URL then.
- **Contract from OpenAPI.** The backend is the source of truth. Types are generated, not written by hand:

  ```bash
  # Backend running in development mode (it serves /api/openapi.json)
  npm run api:types
  ```

  This runs `openapi-typescript` (pinned, via `npx`) and writes `src/app/core/api/schema.d.ts`. The file contains types only, with no runtime code. Use the types with Angular's own HttpClient or `httpResource`:

  ```ts
  import type { components } from '../../core/api/schema';
  type HealthResponse = components['schemas']['HealthResponse'];
  httpResource<HealthResponse>(() => '/api/health');
  ```

  Commit the generated file and regenerate it whenever the backend contract changes. A compile error after regenerating means the contract changed under your code, which is the point. Test fixtures use `satisfies` against the same types, so stubs fail to compile when the contract drifts.

  _Why not OpenAPI Generator?_ It needs Java and generates a large client with services and models for every endpoint. With only `/api/health`, a generated types file plus Angular's HttpClient is the simplest maintainable setup. Revisit this if hand-written service calls start to repeat.

## Development Proxy

`proxy.conf.json` is wired into `ng serve` through `angular.json`:

```json
{ "/api": { "target": "http://localhost:8000", "secure": false } }
```

Every browser request to `http://localhost:4200/api/...` is forwarded by the dev server to the backend, so from the browser's point of view it is same-origin. The backend therefore keeps CORS disabled (`CORS_ORIGINS=[]`). The proxy exists only in `ng serve`, not in production builds.

## Testing

- **Vitest** (`npm test`): component tests with `TestBed` and `HttpTestingController`. Current coverage is the home screen's status logic: healthy shows online; a 503 shows offline; Retry stays focusable while reloading and then recovers to online.
- **Playwright** (`npm run e2e`): real-browser tests against `ng serve`, with `/api/health` stubbed through `page.route`, so the backend is not needed. They cover the lazy route rendering, the unknown-route redirect, and no horizontal overflow at 360px width. Playwright uses the installed Google Chrome (`channel: 'chrome'`), so no browser download is needed. GitHub Actions runners have Chrome preinstalled.
