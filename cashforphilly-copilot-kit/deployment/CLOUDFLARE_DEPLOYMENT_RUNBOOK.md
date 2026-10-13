# Cloudflare Pages deployment runbook

This legacy kit path is retained for old links. The current, complete, preview-first instructions are in the repository root at [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md), and current production blockers are in [`docs/go-live-checklist.md`](../../../docs/go-live-checklist.md).

The canonical repository is `therealvillar/cash-for-philly`; do not create, rename, transfer, or copy it to another repository. This repository is prepared for an owner-controlled Pages preview, not deployed. Do not change DNS or provision real resources as part of code preparation. The root runbook covers the static `dist` build, root `/functions`, `/api/*` routing, Node 24, isolated preview/production D1 and Turnstile configuration, smoke tests, secrets, DNS/mail preservation, rollback, and the production launch gates.
