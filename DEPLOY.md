# Deploy Sunrise GED

## Cloudflare Setup

1. Create a Cloudflare account.
2. Install Wrangler and log in: `npx wrangler login`.
3. Create D1: `npx wrangler d1 create sunrise-ged-db`.
4. Copy the returned database ID into `wrangler.toml`.
5. Run schema: `npx wrangler d1 execute sunrise-ged-db --file=worker/db/schema.sql`.
6. Run seed data: `npx wrangler d1 execute sunrise-ged-db --file=worker/db/seed.sql`.
7. Create R2: `npx wrangler r2 bucket create sunrise-ged-storage`.
8. Set secrets:
   - `npx wrangler secret put JWT_SECRET`
   - `npx wrangler secret put RESEND_API_KEY`
   - `npx wrangler secret put ADMIN_SETUP_TOKEN`
9. Connect the GitHub repo to Cloudflare Pages.
10. Add Pages environment variables matching `wrangler.toml`, including `SITE_URL`, `PUBLIC_R2_BASE_URL`, and `ADMIN_EMAIL`.
11. Add GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
12. Point Namecheap nameservers to Cloudflare.
13. Add the custom domain in Cloudflare Pages settings and enforce HTTPS.

## First Admin

The seed admin hash is intentionally a placeholder. Generate your own bcrypt hash with 12 rounds and replace it in `worker/db/seed.sql` before seeding, or use `/api/auth/setup-admin` with `ADMIN_SETUP_TOKEN` before creating any super admin.
