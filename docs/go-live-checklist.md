# Go-live checklist — production blocked

The repository contains a static Astro site, root-level Pages Functions, `/api/*` routing, and tests for fail-closed lead handling. Those code-level provisions are not evidence of a Cloudflare deployment, live credential setup, successful external verification, legal approval, or production readiness. This checklist records current gates without carrying forward historical test counts or claiming new external checks.

| Gate | State | Required before production |
| --- | --- | --- |
| Existing repository identity and preview-first deployment instructions | CODE PREPARED | Connect `therealvillar/cash-for-philly` to Pages; configure Git integration and review a real PR preview |
| Static output, `/api/*` routing, CI and tests | LOCALLY VERIFIED | Verify generated `dist/`, headers, and API again on an actual Cloudflare PR preview |
| Pages Function runtime bindings | CONFIGURED 2026-10-14 | Pages project `cash-for-philly` has separate preview/production D1 (`cash-for-philly-leads-preview`/`-prod`, migrated) and Turnstile widgets/secrets. Preview verified to reach the API (400 on empty body, 405 on GET); valid-token end-to-end test still needed |
| Legal identity, notices, advertising disclosures, retention and contact details | OWNER DETAILS ADDED | Identity, address, phone and PA license entered in `src/data/site.ts`; privacy/terms drafts still need owner/legal approval |
| Mailbox and investor opt-in | BLOCKED | Verify and monitor the public mailbox; approve and independently test the hosted investor opt-in and its verification flow if enabled |
| Asset rights and final master logo | BLOCKED | Owner confirms provenance and commercial usage rights; restricted trademark illustrations remain excluded |
| DNS, email and custom domain | BLOCKED | Save a full DNS baseline (see [dns-cutover-guide.md](dns-cutover-guide.md)); protect Proton MX/SPF/DKIM/DMARC and Constant Contact authentication; test before/after mail and web behavior and rollback |
| Production lead flow | BLOCKED | End-to-end synthetic Turnstile verification, D1 persistence, invalid-token/failure behavior, authorized query and cleanup |
| Accessibility, mobile, headers and performance | BLOCKED | Test the real preview and record actual outcomes; verify CSP/security headers and target browsers |

## Verification completed in this checkout

- [x] On 2026-10-13, `npm ci`, `npm run check`, `npm run lint`, `npm run test` (31 passed), and `npm run build` succeeded with Node 24. The build generated static pages and `dist/_routes.json` containing only `/api/*`, with no `dist/_worker.js`. The [main-branch Site checks run](https://github.com/therealvillar/cash-for-philly/actions/runs/38474274701) also succeeded; that run is not evidence of a deployed preview.
- [x] A local `npm run preview:pages -- --port 8788` smoke test served static pages, returned 405 for `GET /api/leads` and 503 for a same-origin JSON POST without bindings, and returned CSP and `X-Robots-Tag: noindex` on `/privacy/`. This was a local Wrangler test without real D1 or Turnstile credentials, not an end-to-end lead test or a production header audit.

## Evidence still required from the owner and live providers

- [ ] Connect the existing repository to Cloudflare Pages, inspect a real PR preview and its build output, and confirm static page requests do not invoke Functions.
- [ ] Supply separate real preview and production D1 bindings and Turnstile keys; migrate preview before production and verify each environment independently.
- [ ] Approve verified business identity, legal notices, contact details, disclosures, retention and backup/restore procedures.
- [ ] Verify and monitor the public mailbox; if investor signup is enabled, approve and test the hosted consent and verification flow independently of seller and agent inquiries.
- [ ] Approve the final master logo and commercial rights for each published asset; keep restricted trademark imagery excluded.
- [ ] Export the full DNS baseline, preserve Proton and Constant Contact records, and test web/mail before and after any approved website DNS change, with a tested rollback.
- [ ] On the actual preview, exercise valid and invalid Turnstile submissions, D1 storage, duplicate handling, authorized query and synthetic-record cleanup.
- [ ] Record accessibility, mobile, target-browser, performance and live response-header results; approve production indexing and release only after every preceding gate passes.

The production release remains explicitly blocked until every external gate is approved and tested. Do not change live DNS, provision resources, deploy production, enable production indexing, enable marketing/SMS, or report owner/provider checks as complete based only on a passing build. Seller/agent inquiry forms are not investor subscriptions; investor marketing remains a distinct, separately verified opt-in.
