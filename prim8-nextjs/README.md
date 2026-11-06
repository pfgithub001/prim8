# prim8

A Next.js 16 website (App Router, TypeScript strict, SCSS modules). There's no database and no
API: content lives in typed TS objects in `src/content/`, and the contact form sends email over
SMTP through a server action.

Routes are closed by default. Only routes registered in `src/constants/routes.ts` are reachable,
everything else returns 404, and wrong HTTP methods return 405 (`src/proxy.ts`).

Agent / contributor rules: see [`AGENTS.md`](AGENTS.md).

## Setup

Requires Node 26 (`.nvmrc`) and pnpm.

```sh
pnpm install
cp .env.example .env   # then fill in real values
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Dev server                                     |
| `pnpm build`        | Production build (`output: "standalone"`)      |
| `pnpm start`        | Run the production build                       |
| `pnpm lint`         | ESLint                                         |
| `pnpm format`       | Prettier (write)                               |
| `pnpm format:check` | Prettier (check only)                          |
| `pnpm typecheck`    | Generate Next route types, then `tsc --noEmit` |
| `pnpm check:routes` | Route files and the route registry match       |
| `pnpm check`        | lint + typecheck + format:check + check:routes |

## Environment variables

Validated at startup by `src/env.ts`. The app refuses to start if any is missing or invalid.

| Variable        | Example                        | Description                                  |
| --------------- | ------------------------------ | -------------------------------------------- |
| `SMTP_HOST`     | `smtp.example.com`             | SMTP server host                             |
| `SMTP_PORT`     | `587`                          | SMTP port                                    |
| `SMTP_SECURE`   | `false`                        | `true` for port 465 (TLS), `false` for 587   |
| `SMTP_USER`     | `changeme`                     | SMTP username                                |
| `SMTP_PASSWORD` | `changeme`                     | SMTP password                                |
| `SMTP_FROM`     | `prim8 <no-reply@example.com>` | Sender: an address or `Name <address>`       |
| `CONTACT_TO`    | `hello@example.com`            | Inbox that receives contact form submissions |

Test SMTP in development:

```sh
curl -X POST http://localhost:3000/api/dev/mail-test \
  -H 'content-type: application/json' -d '{"to":"you@example.com"}'
```

## Routes

| Route                | Kind | Methods | Notes                  |
| -------------------- | ---- | ------- | ---------------------- |
| `/`                  | page | GET     | Home + contact form    |
| `/api/health`        | api  | GET     | `{ "status": "ok" }`   |
| `/api/dev/mail-test` | api  | POST    | Dev only (404 in prod) |

## Structure

```
src/
  app/          routing only (page, layout, not-found, route handlers)
  views/        one per page (HomeView, NotFoundView), with view-local sections/
  sections/     sections shared by 2+ views
  components/   reusable UI (Button, TextField, ContactForm)
  server/       server-only code: mail/ (sendMail + templates), contact/actions.ts
  schemas/      zod schemas + types (contact, mail)
  hooks/        shared client hooks
  lib/          pure helpers (routes: matchRoute/href, escapeHtml)
  constants/    route registry, site constants, anchors
  content/      typed site content
  styles/       _variables.scss, _mixins.scss, globals.scss
  env.ts        validated env (the only reader of process.env)
  instrumentation.ts  validates env at boot
  proxy.ts      closes unregistered routes (404) and wrong methods (405)
public/assets/  static files (the only public path that's served)
scripts/check-routes.ts
```
