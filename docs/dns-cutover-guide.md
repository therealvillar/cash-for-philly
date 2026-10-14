# DNS baseline and custom-domain cutover guide

Zone `cashforphilly.com` is active on Cloudflare (nameservers `ridge.ns.cloudflare.com`, `veda.ns.cloudflare.com`). Pages project `cash-for-philly` exists at `cash-for-philly.pages.dev`. No DNS change has been made.

## 1. Save the baseline (required, no edits)

Cloudflare dashboard → `cashforphilly.com` → DNS → Records → **Export DNS records**. Save the file with today's date and keep an offline copy. (The Wrangler OAuth login lacks DNS scope, so this could not be exported automatically.)

Public lookups confirm these records must survive untouched:

- MX: `mail.protonmail.ch`, `mailsec.protonmail.ch`
- TXT SPF: `v=spf1 include:_spf.protonmail.ch ~all`
- TXT: `protonmail-verification=…`
- Also confirm in the export: Proton DKIM CNAMEs (`protonmail*._domainkey`), `_dmarc`, and Constant Contact records. Do not delete, rename or proxy any of them. Mail CNAMEs must stay DNS-only (grey cloud).

## 2. Edits needed to launch the website (only after approval)

Only these website records should change:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` (apex) | `cash-for-philly.pages.dev` | Proxied |
| CNAME | `www` | `cash-for-philly.pages.dev` | Proxied |

Easiest path: Pages → `cash-for-philly` → Custom domains → add `cashforphilly.com` and `www.cashforphilly.com`; Cloudflare creates these records. First remove or replace any existing apex/`www` A/AAAA/CNAME records that conflict, and note them in the baseline. Add a redirect from `www` to apex (or the reverse) if desired.

## 3. Test and roll back

1. Before: send and receive a test email on `contact@cashforphilly.com`.
2. After: confirm HTTPS on both hostnames, re-export the zone and diff against the baseline (only the two website records may differ), repeat the mail test, and confirm Constant Contact domain authentication still shows verified.
3. Rollback: delete the two new CNAMEs and re-create the removed website records exactly from the baseline.

Production indexing stays off until launch approval: set `PUBLIC_DEPLOY_ENV=production` in the Pages production environment and enable production deployments.
