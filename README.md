# CashForPhilly

Static Astro website with separate homeowner and agent inquiry funnels, an investor Constant Contact opt-in **integration point**, and a Cloudflare Pages Function backed by isolated D1 and Turnstile. **Not deployed or approved for production**; see [go-live gates](docs/go-live-checklist.md).

## Local development

Node 24: `npm ci`, `npm run dev`, `npm run check`, `npm run lint`, `npm run test`, `npm run build`, `npm run preview`. `astro preview` serves static HTML, **not** Pages Functions. Copy `.env.example` to `.env.local` for preview-only **public** widget values; keep runtime secrets in ignored `.dev.vars` or Cloudflare encrypted secrets, never in Git. Set `PUBLIC_DEPLOY_ENV=production` only when owner-approved production indexing is intended. Without a Turnstile sitekey, forms visibly say not configured.

The selected originals are copied from `cashforphilly-brand-kit/` into `public/assets` without altering the logo. See [asset manifest](docs/asset-manifest.md) for exact sources, dimensions and rights review. Do not use restricted images.

## Operational guide

- [Architecture and separate environments](docs/architecture.md)
- [Threats and security controls](docs/security.md)
- [Cloudflare Git setup, D1 migration, preview and rollback](docs/deploy-cloudflare.md)
- [Constant Contact signup (not yet configured)](docs/constant-contact.md)
- [Operator-only lead retrieval, export and deletion](docs/lead-operations.md)
- [Go-live blockers and legal review](docs/go-live-checklist.md)

Edit central contact/business fields in `src/data/site.ts`, neighborhoods in `src/data/neighborhoods.ts`, and FAQs in `src/data/faqs.ts`. The public mailbox has **not** been verified. No Proton or Constant Contact DNS record should be modified for site deployment. This repository currently has a different remote from the proposed `therealvillar/cashforphilly-site`: do not repurpose it or initialize Cloudflare Direct Upload.
