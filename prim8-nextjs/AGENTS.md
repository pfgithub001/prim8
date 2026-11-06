# prim8: Agent Instructions

Rules for developing in this project. Rules marked **MUST** are non-negotiable. If one conflicts
with a request, stop and ask the user instead of breaking it.

## 1. Stack

- **Next.js 16.4.5** (App Router) · React · TypeScript (strict)
- **pnpm** · Node **26** (`.nvmrc`)
- **SCSS modules** (no Tailwind, no CSS-in-JS, no UI library)
- **ESLint + Prettier** · **zod** for validation · **nodemailer** for email
- Data: **No DB, no API**

The project tracks the **latest stable Next.js**, which may be newer than what you know. Check
the current Next.js docs before using an API you're unsure about.

## 2. Commands

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Dev server                                     |
| `pnpm build`        | Production build                               |
| `pnpm start`        | Run the production build                       |
| `pnpm check`        | lint + typecheck + format:check + check:routes |
| `pnpm lint`         | ESLint                                         |
| `pnpm format`       | Prettier (write)                               |
| `pnpm typecheck`    | `next typegen && tsc --noEmit`                 |
| `pnpm check:routes` | Every route file is registered, and vice versa |

## 3. Structure: Views > Sections > Components

```
src/
  app/          routing only: page/layout/route/loading/error/not-found files
  views/        one per page (XView), arranges sections; local sections in XView/sections/
  sections/     sections shared by 2+ views
  components/   reusable UI building blocks
  server/       server-only code: mail/, <domain>/queries.ts, mutations.ts, actions.ts
  schemas/      zod schemas + inferred types, per domain
  hooks/        shared client hooks
  lib/          pure helpers (incl. routes.ts: matchRoute, href)
  constants/    app-wide constants (incl. routes.ts: the route registry)
  content/      typed site content
  styles/       _variables.scss, _mixins.scss, globals.scss
  env.ts        the only place that reads process.env
```

**Where does it go?**

| You're adding…                     | Put it in                                              |
| ---------------------------------- | ------------------------------------------------------ |
| a new page                         | `app/<path>/page.tsx` + `views/<Name>View/` + registry |
| a block of a page                  | `views/<Name>View/sections/<Section>/`                 |
| a block used on 2+ pages           | `sections/<Section>/`                                  |
| a reusable UI element              | `components/<Name>/`                                   |
| data loading / writing             | `server/<domain>/`                                     |
| validation / shared types          | `schemas/<domain>.ts`                                  |
| a pure helper                      | `lib/`                                                 |
| a fixed value used in code         | `constants/`                                           |
| a color, spacing value, breakpoint | `styles/_variables.scss`                               |
| an email                           | `server/mail/templates/`                               |

Rules (MUST):

- `src/views/`, **never `src/pages/`**. Next.js reserves `pages/` for the Pages Router.
- **Dependency direction:** `app → views → sections → components`. A lower layer never imports
  a higher one. A view never imports another view's local sections.
- **Promotion:** a section or component starts inside the view that uses it. When a second view
  needs it, move it to `src/sections/` or `src/components/`. Don't copy it.
- `app/` files stay thin: they read params, load data through `server/`, and render a view.

## 4. Development patterns (MUST)

- **No code duplication. Reuse first.** Before writing a component, section, hook, helper,
  schema, constant or style, search for an existing one (`src/components`, `src/sections`,
  `src/lib`, `src/hooks`, `src/schemas`, `styles/_mixins.scss`). Extend it with props or variants
  instead of copying it. When the same logic or markup appears a second time, extract it. Never
  copy-paste blocks.
- **Small, single-purpose units.** One component per file, each doing one job. Split a file once
  it grows past ~200 lines. Keep business logic out of JSX: put it in `server/`, `lib/` or a
  hook.
- **One data-access layer.** Views, sections and components never call `fetch` or the database.
  Route files and server actions call `server/<domain>/` functions and pass the data down as
  props.
- **Typed props, no magic values.** Every component has an explicit `Props` type. Literal values
  live in `constants/`. Colors, spacing, radii, breakpoints and z-indexes come from
  `_variables.scss` / `_mixins.scss`, never hard-coded in a module.

## 5. Code conventions (MUST)

- **Folder per unit:** `Name/Name.tsx` + `Name.module.scss` (if styled) + `index.ts`,
  PascalCase, named exports only. Other files use camelCase.
- **Server Components by default.** Add `"use client"` only for state, effects, browser APIs or
  event handlers, and put it on the smallest leaf component possible.
- Server-only modules start with `import "server-only"`. Secrets, the DB and SMTP never reach
  client code.
- **Validate every external input with zod:** request bodies, route params, search params, form
  data and external API responses.
- `@/` imports. No `any`, no unchecked `as` casts, no `// @ts-ignore`.
- Read env only through `src/env.ts`. The one exception is `src/proxy.ts`, which reads
  `process.env.NODE_ENV`. A new variable goes into `env.ts`, `.env.example` and the README in
  the same change.
- **Styling:** SCSS modules only. Start each module with `@use "variables" as *;` and
  `@use "mixins" as *;`. No inline styles except truly dynamic values.

## 6. Routes are closed by default (MUST)

Only registered routes can be reached. Anything else returns 404, and a wrong HTTP method
returns 405.

To add a page or API endpoint:

1. Create the file in `src/app/`.
2. Register it in `src/constants/routes.ts` (`pattern`, `kind`, `methods` for API routes).
3. Link to it with `href("name", params)` from `src/lib/routes.ts`. Never write path strings by
   hand.
4. Run `pnpm check:routes`.

- Debug, test and preview routes get `devOnly: true` **and** guard themselves inside the route
  (`notFound()` / a 404 response when `env.NODE_ENV === "production"`).
- When you delete a route, delete its registry entry too.
- **Never** widen the matcher in `src/proxy.ts`, add catch-all routes, or bypass the registry
  to "make it work". Ask the user instead.
- Static files go in `public/assets/`. Other paths in `public/` are blocked.

## 7. Email (MUST)

- Send mail **only** through `sendMail()` in `src/server/mail/`. Nothing else creates a
  transporter or talks to SMTP.
- Config comes only from the `SMTP_*` variables via `src/env.ts`.
- Each email is a template in `src/server/mail/templates/` that returns
  `{ subject, html, text }`. Always provide both HTML and plain text.
- Test with `POST /api/dev/mail-test` (`{ "to": "…" }`) under `pnpm dev`. It's dev-only.

## 8. Data layer

**No DB, no API.**

- Content lives in `src/content/` as typed TS objects. Route files read it and pass it to views
  as props.
- Forms: a client form component → a server action in `src/server/<domain>/actions.ts` → zod
  validation → `sendMail()` if it sends email.
- Pages are statically rendered. Don't add dynamic rendering without a reason.

## 9. Dependencies (MUST)

- **Ask the user before adding any new package.** Explain why the existing code and
  dependencies aren't enough.
- Use pnpm only. When adding or upgrading, use the **latest stable** version.

## 10. Keep docs in sync (MUST)

When you add an env variable, script, route or major feature, or change a convention, update the
relevant files **in the same change**: `src/env.ts`, `.env.example`, `README.md`,
`src/constants/routes.ts`, and this `AGENTS.md`.

## 11. Definition of done (MUST)

A task is done only when:

1. `pnpm check` passes.
2. `pnpm build` passes.
3. For route or API changes, you started the app and hit the endpoint (expected status codes,
   including 404/405 where relevant).

If something can't be verified (e.g. missing credentials), say so. **Never claim it works if it
doesn't.**
