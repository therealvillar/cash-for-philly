# Cloudflare Pages deployment preparation

This guide deploys the existing [`therealvillar/cash-for-philly`](https://github.com/therealvillar/cash-for-philly) repository. Do not create, rename, transfer, or copy the project to another GitHub repository. This repository is prepared for deployment but has not been connected to Cloudflare or deployed. Use a preview first; this guide does not authorize production launch, DNS changes, or cloud resource provisioning.

## Code-ready deployment shape

- The repository root is the Pages build root. CI and Pages run `npm ci` and `npm run build` with Node 24; Astro emits a static site to `dist/`.
- Pages Functions source remains in the repository-root `functions/` directory. Native Pages Git integration compiles this directory alongside the static output. Do not move Functions into `src/pages` or `dist/`.
- `public/_routes.json` is copied to `dist/_routes.json` and includes only `/api/*`. Static page requests must not invoke Functions; the build must not emit an `_worker.js` catch-all.
- `npm run preview` previews static HTML only. After `npm run build`, `npm run preview:pages` starts Wrangler Pages local development and discovers the root `functions/` directory. Without configured local bindings and secrets, the API must fail closed.
- The existing workflow runs install, check, lint, all tests, and build on pushes and pull requests. Require those checks before merges to the production branch.

## Connect the existing repository and verify a preview

1. In Cloudflare Workers & Pages, create a Pages project by importing the existing Git repository `therealvillar/cash-for-philly`. Authorize the GitHub app only as needed for this repository. Do not initialize a Direct Upload project.
2. Configure the repository root (`/`), the existing production branch (`main`), build command `npm run build`, and output directory `dist`. Enable pull-request preview deployments. Keep automatic production deployment disabled until all launch gates below are approved.
3. Set Node.js to 24 if the dashboard exposes a runtime version setting. Confirm the Pages build log uses the lockfile and succeeds; package `engines` specifies `>=24 <25`.
4. Review the actual preview URL and confirm all generated pages, 404, sitemap, canonical URLs, and approved assets load. Check response headers against `public/_headers`, including CSP and noindex headers for privacy, terms, and thank-you pages. Verify the page routes stay static.
5. Exercise `/api/leads`: `GET` must return 405; a POST with missing bindings/secret must return 503; invalid Turnstile must not write; a valid synthetic preview submission must return success only after D1 persistence; duplicate submission must return 409. Query and delete the synthetic row using authorized D1 access. Do not submit real personal data for testing.

## Isolated Pages bindings and secrets

Configure preview and production independently in the Pages dashboard; production values must not be copied from preview by assumption.

| Setting | Preview | Production |
| --- | --- | --- |
| D1 binding | Bind a dedicated preview database as `LEADS_DB` | Bind a separate production database as `LEADS_DB` |
| Turnstile secret | Add the preview widget secret as encrypted runtime secret `TURNSTILE_SECRET_KEY` | Add the production widget secret as encrypted runtime secret `TURNSTILE_SECRET_KEY` |
| Turnstile site key | Set matching public build variable `PUBLIC_TURNSTILE_SITE_KEY` | Set matching public build variable `PUBLIC_TURNSTILE_SITE_KEY` |
| Indexing | Set build variable `PUBLIC_DEPLOY_ENV=preview` | Set `PUBLIC_DEPLOY_ENV=production` only after explicit launch approval |
| Investor signup | Leave `PUBLIC_CONSTANT_CONTACT_FORM_URL` unset until the hosted signup and consent flow are approved and verified | Configure only after the approved hosted signup is independently verified |

`TURNSTILE_SECRET_KEY` and any future provider credentials are runtime-only secrets. Never name them `PUBLIC_*`, put them in `.env.example`, commit `.dev.vars`, or expose them to browser code, public assets, build logs, or client bundles. A Turnstile site key is public by design. `.env.example` contains only empty/public build-time settings, and `.dev.vars*` / `.env.*` are ignored by Git.

Create two new, isolated D1 databases in the owner-controlled Cloudflare account; do not reuse another application's database. Apply `db/migrations/0001_create_leads.sql` to preview first, validate it, then apply the reviewed migration to production. If using authenticated Wrangler instead of the dashboard SQL console, replace the placeholder with the actual database name and verify the target before running:

```sh
npx wrangler d1 execute <actual-preview-database-name> --remote --file=db/migrations/0001_create_leads.sql
```

Repeat only after review for the actual production database. Do not put database IDs or secrets in repository configuration. Recheck D1 bindings after changing them, since Pages may need a new deployment before bindings take effect.

For a local static/Functions smoke test, run:

```sh
npm ci
npm run build
npm run preview:pages
```

Use Wrangler's local bindings/secrets configuration only with synthetic data and ignored local files. The documented command intentionally does not invent a D1 ID or secret; it verifies route discovery, static delivery, and fail-closed API behavior until real isolated preview credentials are provided.

## DNS, mail, and rollback safeguards

Do not change live DNS as part of repository preparation or preview setup. Before any separately approved production domain connection:

1. Export and save the complete current DNS zone as a dated baseline and keep an offline copy. Record current web records, nameservers, TTLs, and relevant routes.
2. Specifically capture and protect every Proton MX, SPF, DKIM, DMARC, and mail-routing record, plus all Constant Contact verification/authentication records. Do not delete, proxy, rename, or replace mail records.
3. Compare the proposed change against the baseline and approve only the necessary website records. Preserve the baseline and a precise rollback procedure.
4. Verify website and HTTPS behavior, then compare the full zone against the saved baseline. Test inbound and outbound mail through the verified mailbox and confirm Constant Contact domain verification remains intact. These checks have not been performed.

For an application regression, restore the last known-good Pages deployment or revert the reviewed Git commit, then repeat static/API/header smoke tests. Restore only deliberately changed website DNS records from the saved baseline if a separately approved DNS change fails. Do not roll back a D1 schema destructively after leads exist; make and verify an independent backup/restore plan first.

## Production remains blocked

Do not launch or enable production indexing/lead capture until the owner completes and approves all gates in [the go-live checklist](go-live-checklist.md): legal identity and notices; verified and monitored mailbox; approved, verified investor opt-in if used; separate real preview/production D1 and Turnstile configuration with end-to-end tests; asset provenance and commercial-rights review; and a tested DNS preservation/rollback procedure. A successful local build or preview is not production approval.

Official references:

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Astro on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Pages Functions get started](https://developers.cloudflare.com/pages/functions/get-started/)
- [Pages Functions routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
