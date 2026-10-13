# Go-live checklist — production blocked

The repository contains a static Astro site, root-level Pages Functions, `/api/*` routing, and tests for fail-closed lead handling. Those code-level provisions are not evidence of a Cloudflare deployment, live credential setup, successful external verification, legal approval, or production readiness. This checklist records current gates without carrying forward historical test counts or claiming new external checks.

| Gate | State | Required before production |
| --- | --- | --- |
| Existing repository identity and preview-first deployment instructions | CODE PREPARED | Connect `therealvillar/cash-for-philly` to Pages; configure Git integration and review a real PR preview |
| Static output, `/api/*` routing, CI and tests | CODE PREPARED | Run CI and verify generated `dist/` and actual preview behavior |
| Pages Function runtime bindings | BLOCKED | Configure and test separate real preview/production `LEADS_DB` bindings and Turnstile secrets/site keys |
| Legal identity, notices, advertising disclosures, retention and contact details | BLOCKED | Owner/legal approval; populate only verified information |
| Mailbox and investor opt-in | BLOCKED | Verify and monitor the public mailbox; approve and independently test the hosted investor opt-in and its verification flow if enabled |
| Asset rights and final master logo | BLOCKED | Owner confirms provenance and commercial usage rights; restricted trademark illustrations remain excluded |
| DNS, email and custom domain | BLOCKED | Save a full DNS baseline; protect Proton MX/SPF/DKIM/DMARC and Constant Contact authentication; test before/after mail and web behavior and rollback |
| Production lead flow | BLOCKED | End-to-end synthetic Turnstile verification, D1 persistence, invalid-token/failure behavior, authorized query and cleanup |
| Accessibility, mobile, headers and performance | BLOCKED | Test the real preview and record actual outcomes; verify CSP/security headers and target browsers |

The production release remains explicitly blocked until every external gate is approved and tested. Do not change live DNS, provision resources, deploy production, enable production indexing, enable marketing/SMS, or report owner/provider checks as complete based only on a passing build. Seller/agent inquiry forms are not investor subscriptions; investor marketing remains a distinct, separately verified opt-in.
