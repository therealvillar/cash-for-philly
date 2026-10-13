# CashForPhilly - Cloudflare Pages deployment runbook

## 0. Preconditions

- GitHub account: `therealvillar`. Proposed new repo: `cashforphilly-site`, preferably private.
- The actual Astro project must be generated and pass local tests first. This starter kit does NOT yet contain a completed website.
- Original branded assets must be imported from the previous project pack and approved, not regenerated.
- The Cloudflare account managing `cashforphilly.com` and GitHub account must both be accessible. Have Cloudflare MFA and GitHub authentication enabled.
- Review existing DNS records; in particular protect all Proton Mail MX, SPF, DKIM and DMARC records and Constant Contact send-domain verification records.

## 1. Build and test locally (PowerShell in VS Code)

Run in the site repo AFTER Copilot creates the Astro files:

```powershell
npm ci
npm run check
npm run lint
npm run test
npm run build
```

For an Astro static site, the expected output directory is `dist/`. Inspect it. Do not attempt to publish only the prompt ZIP. If package scripts vary, check `package.json` and use its exact scripts.

## 2. Create the GitHub repository

1. Open https://github.com/new while signed in as `therealvillar`.
2. Repository name: `cashforphilly-site`; Description: `CashForPhilly marketing website and lead intake`.
3. Visibility: Private preferred unless there is a deliberate reason to open the source.
4. If you already have a local project with README, leave GitHub's automatic initial README off to avoid an unrelated initial commit.
5. Select **Create repository**. Copy the actual remote URL shown by GitHub.
6. In the VS Code terminal from the project root, if `git init` was not run earlier:

```powershell
git init
git branch -M main
git add .
git commit -m "feat: launch CashForPhilly Astro website"
git remote add origin https://github.com/therealvillar/cashforphilly-site.git
git push -u origin main
```

If there is already a Git repository/remote, do not blindly run `git init` or `remote add` again. Use `git remote -v` and `git status` to inspect first. Do not push `.dev.vars`, `.env.local`, API tokens, private backup files, confidential lead data, or unneeded original archives. The committed source should contain LICENSED/approved optimized public site assets.

## 3. Create a GIT-INTEGRATED Cloudflare Pages project FIRST

Do not run `wrangler pages project create` or initialize with Direct Upload when a Git-connected project is desired. Cloudflare does not support switching an initially Direct Upload project to native Git integration.

1. Navigate to https://dash.cloudflare.com/ and select your correct Cloudflare account.
2. Open **Workers & Pages**.
3. Click **Create application**, select **Pages**, then **Import an existing Git repository** (UI labels can vary).
4. Choose GitHub and authorize Cloudflare's GitHub App if prompted. Limit app access to the `cashforphilly-site` repository where possible.
5. Select `therealvillar/cashforphilly-site` and choose **Begin setup**.
6. Configure project name `cashforphilly-site`; Production branch `main`; Build command `npm run build`; Output directory `dist`; Repo root `/`. If Cloudflare offers an Astro preset, confirm these values.
7. Select **Save and Deploy**. Wait for the actual status to say success and open the new real `*.pages.dev` URL.
8. Review Cloudflare build logs before continuing. A successful static build does not establish that D1 forms are functional.

Official docs: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ ; https://developers.cloudflare.com/pages/configuration/git-integration/

## 4. Create lead database and Turnstile configuration

1. In Cloudflare go to **Workers & Pages > D1 SQL database** (actual navigation may vary). Create a NEW database `cashforphilly-web-leads`. Do not reuse another application's `marketplace-activity` database.
2. Obtain the database ID from Cloudflare. Use the site's schema migration files in `db/migrations/`, or the actual Wrangler migration commands documented by generated code; apply to a local or test DB first, then production. Ensure a backup/rollback procedure exists.
3. Open **Workers & Pages > cashforphilly-site > Settings > Bindings > Add > D1 database**. Variable name `LEADS_DB`; choose the new database; save and redeploy. Configure preview bindings separately, preferably using a second D1 database.
4. Open **Turnstile** in Cloudflare, create a widget authorized for `cashforphilly.com`, `www.cashforphilly.com`, and your verified preview hostname if required. Record the PUBLIC sitekey; save the PRIVATE secret only under Cloudflare Pages **Settings > Variables and Secrets** as `TURNSTILE_SECRET_KEY`, set for runtime. Expose ONLY the public sitekey to Astro's build-time environment as `PUBLIC_TURNSTILE_SITE_KEY` (or the exact name in generated code).
5. Test a real form submission on the preview hostname with synthetic data and query that record using authorized D1 tooling. Verify rejected invalid Turnstile and repeated requests. Clean up synthetic data.
6. Enable CC subscription forms only with an actual approved embed/form ID, a valid privacy link and explicit opt-in. Never automatically enroll raw homeowner inquiries or imported MLS contacts.

Official docs: https://developers.cloudflare.com/pages/functions/bindings/ ; https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## 5. Connect the domain WITHOUT breaking email

1. Take a DNS snapshot of the entire `cashforphilly.com` zone first, especially MX/SPF/DKIM/DMARC and Constant Contact CNAME/TXT selectors. Keep all email records intact.
2. Verify the preview `*.pages.dev` site passes smoke tests and has the approved logo/artwork.
3. Open **Workers & Pages > cashforphilly-site > Custom domains > Set up a domain**.
4. Enter `cashforphilly.com` and follow Cloudflare prompts. Since the domain already uses Cloudflare DNS, the dashboard should provision the necessary website record; verify the existing zone/account before approving changes.
5. Optionally add `www.cashforphilly.com` and redirect one hostname to the canonical one; avoid a redirect loop. Keep canonical URLs consistent with `https://cashforphilly.com`.
6. Allow certificate provisioning and test HTTPS for root and www with a mobile browser. Retest email delivery to `contact@cashforphilly.com` from an external mailbox.

Official docs: https://developers.cloudflare.com/pages/configuration/custom-domains/

## 6. Verify production release

- Homepage, six supporting pages, privacy/terms, and 404 actually load.
- Approved logo and all images load; mobile responsive at 360px, 390px and tablet/desktop widths.
- Turnstile server-side validation works on actual custom domain.
- Form writes successfully to production D1 and returns success only afterward.
- No public endpoint lists or exposes leads. Bad payloads do not insert data.
- Constant Contact signup succeeds only if actual embed/API is configured; marketing checkbox separate from property inquiry.
- SSL, canonical tags, robots/sitemap and actual OG images work.
- No secrets leaked; CSP and other headers pass reasonable checks.
- Proton inbound mail, its MX/SPF/DKIM/DMARC and Constant Contact authentication still work.
- Confirm website-specific domain record changes only; preserve unrelated subdomain routes.
- Cloudflare Git integration deploys from merges to `main` and previews PR branches.

## 7. Release management

- Make updates on branches, inspect Cloudflare preview URLs, require CI pass, then merge to `main`.
- If a release breaks, restore the last known good deployment through Cloudflare Pages deployments UI or revert the Git commit, then verify forms and DNS. Avoid destructive DB schema rollbacks while leads exist.
- D1 on Free plan has quotas and may start returning errors when limits are hit. Monitor metrics and alerting; preserve captured leads and test non-success paths.
- Email alerts are NOT automatically provided just because data is saved to D1. Set up and verify a transactional notification integration before relying on email alerts. Until then, use an operator-controlled D1 lead check routine.

## Current status

Prepared build prompt and runbook only. GitHub repository creation, Copilot code generation, Cloudflare Pages project creation, database/secret provision, and production cutover are NOT completed by preparing this kit.
