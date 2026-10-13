# Architecture

Astro builds static HTML under `dist/`, with content in `src/pages`, shared layouts/components in `src/` and editable wording in `src/data`. Native Pages Git integration deploys `dist/` from `main` and PR preview builds. `public/_routes.json` sends only `/api/*` to Pages Functions; `functions/api/leads.ts` is a POST-only lead intake with server-side Turnstile Siteverify and D1 prepared insert. This is not an authenticated admin API; operator access to leads must be via the Cloudflare console. No database ID, custom domain or Pages project is provisioned in this repository.

Use separate production/preview databases and Turnstile credentials. The public widget sitekey and build environment marker are build-time variables; `TURNSTILE_SECRET_KEY` and D1 binding `LEADS_DB` exist only at runtime. Missing settings fail closed. No webhook or email notification is configured.
