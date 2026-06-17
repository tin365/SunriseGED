# Sunrise Trauma Healing Education Website

Production-oriented Vite + React + Cloudflare project for Sunrise GED in Mae Sot, Thailand. The site includes public pages in English, Burmese, and Thai, a Cloudflare Worker API, D1 schema, R2 media upload flow, admin screens, and Resend email templates.

## Stack

- Vite + React 18 (single-page app, React Router) in TypeScript
- Tailwind CSS v3
- Cloudflare Pages (static SPA + Pages Functions), Workers, D1, and R2
- Hono API framework
- Resend email
- Custom JWT sessions with TOTP 2FA

## Architecture

- **Frontend** — a static React SPA built by Vite to `dist/`, deployed to Cloudflare Pages.
- **API** — a standalone Hono Worker (`worker/`) deployed with `wrangler deploy -c worker/wrangler.toml`.
- **Same-origin `/api`** — `functions/api/[[path]].ts` (a Pages Function) forwards every `/api/*` request to the API Worker via the `API` service binding declared in the root `wrangler.toml`. This keeps requests same-origin so the Worker's `SameSite=Strict` `sunrise_session` cookie works without CORS. Do not call the Worker's `*.workers.dev` URL directly.
- **SPA fallback** — `public/_redirects` (`/* /index.html 200`) serves the app shell for client-side routes; Pages Functions and static assets take precedence over it.

## Local Development

```bash
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run worker:dev   # API Worker on http://localhost:8787
```

The Vite dev server proxies `/api` to `http://localhost:8787` (see `vite.config.ts`). Worker development uses Wrangler and requires local Cloudflare bindings or remote development configuration.

Useful scripts: `npm run build` (type-check + Vite build), `npm run check` (app type-check), `npm run check:worker` (Worker type-check), `npm run preview` (`wrangler pages dev dist`).

## Environment Variables

Set these through Wrangler secrets or Cloudflare Pages settings:

- `JWT_SECRET`
- `RESEND_API_KEY`
- `ADMIN_SETUP_TOKEN`
- `SITE_URL`
- `PUBLIC_R2_BASE_URL`
- `ADMIN_EMAIL`

Do not commit real secrets.

## Database

```bash
npm run db:migrate
npm run db:seed
```

The seed admin password hash is a placeholder. Generate a real bcrypt hash for your chosen password before production.

## Languages

Translations live in `src/i18n/en.json`, `src/i18n/my.json`, and `src/i18n/th.json`. The active locale comes from the route: English is unprefixed (`/about`), Burmese and Thai are prefixed (`/my/about`, `/th/about`). Add a language by creating a new dictionary, adding it to `src/lib/i18n.ts` (`locales`/`dictionaries`), and it becomes available through the `:lang` route in `src/App.tsx`.

## Admin Guide

See `ADMIN_GUIDE.md` for daily use. The `/admin` routes are guarded client-side by `RequireAuth` (which calls `GET /api/auth/me`); the real enforcement is server-side — every sensitive API route enforces JWT sessions and roles.

## Deployment

See `DEPLOY.md` for Cloudflare, D1, R2, and DNS steps.

## Troubleshooting

- Login loops usually mean the Worker API is not setting the `sunrise_session` cookie on the same domain — check that the `API` service binding is configured and the frontend is not calling the Worker's `*.workers.dev` URL directly.
- D1 errors usually mean the schema has not been applied or the database ID in `worker/wrangler.toml` is still the placeholder.
- R2 upload errors usually mean the bucket binding or public media base URL is not configured.
- Missing email means `RESEND_API_KEY` or verified sending domain setup is incomplete.
