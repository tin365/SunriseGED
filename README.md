# Sunrise Trauma Healing Education Website

Production-oriented Astro + Cloudflare project for Sunrise GED in Mae Sot, Thailand. The site includes public pages in English, Burmese, and Thai, a Cloudflare Worker API, D1 schema, R2 media upload flow, admin screens, Resend email templates, and a local printer/scanner bridge.

## Stack

- Astro 4 with React islands
- Tailwind CSS v3
- Cloudflare Pages, Workers, D1, and R2
- Hono API framework
- Resend email
- Custom JWT sessions with TOTP 2FA

## Local Development

```bash
npm install
npm run dev
npm run worker:dev
```

Run the frontend at `http://localhost:4321`. Worker development uses Wrangler and requires local Cloudflare bindings or remote development configuration.

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

Translations live in `src/i18n/en.json`, `src/i18n/my.json`, and `src/i18n/th.json`. Add a language by creating a new dictionary, adding it to `src/lib/i18n.ts`, and creating localized routes.

## Admin Guide

See `ADMIN_GUIDE.md` for daily use. Admin routes are protected by cookie middleware and every sensitive API route enforces JWT sessions and roles.

## Printer Bridge

The bridge is in `bridge/`. It runs on the admin computer and talks to local printers/scanners. See `bridge/README.md`.

## Deployment

See `DEPLOY.md` for Cloudflare, D1, R2, GitHub Actions, and Namecheap DNS steps.

## Troubleshooting

- Login loops usually mean the Worker API is not setting the `sunrise_session` cookie on the same domain.
- D1 errors usually mean the schema has not been applied or the database ID in `wrangler.toml` is still the placeholder.
- R2 upload errors usually mean the bucket binding or public media base URL is not configured.
- Missing email means `RESEND_API_KEY` or verified sending domain setup is incomplete.
