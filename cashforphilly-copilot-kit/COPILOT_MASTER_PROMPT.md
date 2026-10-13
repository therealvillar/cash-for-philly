# CashForPhilly.com - GitHub Copilot Agent: Build, Test, and Prepare Cloudflare Pages Deployment

You are the senior full-stack engineer, conversion-focused real-estate website designer, accessibility reviewer, and release engineer for CashForPhilly.com. You are working in a NEW GitHub repository intended to deploy to Cloudflare Pages. THIS IS AN IMPLEMENTATION REQUEST. Create all necessary project files, actual page components, styles, responsive layouts, tests, serverless endpoints, documentation, and deployment configuration. Do not answer with only a plan or illustrative snippets. After implementation, run checks, fix failures, commit tested code, push when authenticated, and guide or carry out the Cloudflare Git-integrated deployment where authorized.

## 0. Non-negotiable project context

- Brand/site: CashForPhilly, https://cashforphilly.com.
- Region: Philadelphia, Pennsylvania. Brand motif: locally recognizable, pixel-art / 8-bit Philadelphia neighborhood imagery combined with a polished, modern, accessible editorial UI. Do NOT build a generic corporate-real-estate template or a game UI.
- Primary audience and conversion: Philadelphia-area homeowners considering a sale or requesting a discussion about their property's condition, timing, and options. Primary CTA: "Explore selling options". Place it above the fold and repeat it reasonably.
- Secondary audiences: real-estate agents/wholesalers submitting a property, and investors subscribing to verified opportunity updates. Keep funnels separate and track distinct conversion events.
- Messaging verified from the existing campaign design: eyebrow "PHILLY ROOTS. PROPERTY OPTIONS."; H1 "Your Philly property. Your next move."; supporting text about discussing a house, rental or inherited property, condition, timing, and numbers; supporting claim "No renovation required just to start a conversation." Do not promise a cash offer, guaranteed closing date, specific price, fee waiver, brokerage compensation or transaction outcome without actual business verification.
- Public replies/marketing identity under review: contact@cashforphilly.com (mailbox is handled by Proton). DO NOT assume it works until independently tested. Website contact information must be centralized in a config module and easily changed.
- Cloudflare already provides the DNS management for this domain. Proton Mail and Constant Contact use existing email DNS records. NEVER alter or delete MX, SPF, DKIM, DMARC, email routing or verification records during website deployment.
- Desired hosting cost: Cloudflare Pages Free plan plus free-tier Cloudflare Functions/D1/Turnstile as applicable. No Wix, Squarespace, WordPress, paid page builder, paid CDN, self-hosted Windows server, or other recurring hosting dependency.
- GitHub account: therealvillar. Proposed new repository: therealvillar/cashforphilly-site. Do not overwrite or repurpose an unrelated repository.
- Existing related cloud/database projects must remain isolated. In particular, do not bind website lead capture to an existing unrelated `marketplace-activity` D1 database. Create a new `cashforphilly-web-leads` D1 database.

## 1. Asset inventory and strict source-of-truth rules

PRIORITY #1: REUSE ORIGINAL ARTWORK; DO NOT REGENERATE LOGO OR SILENTLY SUBSTITUTE INTERNET STOCK ART.

The previous brand pack was prepared in another conversation. The asset packages may be copied into this repository under `asset-imports/` or supplied as a local folder by the human operator. First inventory and inspect all supplied files, then create `docs/asset-manifest.md` listing each file used, originating archive, license/provenance caveats, pixel dimensions, its intended placement, and any unverified/missing source.

Expected source archives/folders (filenames from the previous campaign kit):
- `cashforphilly-marketing-brand-kit.zip` - master logo, its email-optimized horizontal rendition, pixel-art marketing pieces, brand guide, and design tokens.
- `cashforphilly-neighborhoods-48-icons.zip` - previously produced Philadelphia neighborhood icons.
- `cashforphilly-property-actions-35-icons.zip` - property/action icons.
- `cashforphilly-brand-kit/` - expanded working assets when available, including `marketing/cashforphilly-campaign-wide-1200x630.png` and `cashforphilly-social-square-1080x1080.png`.
- Separately saved original logo may exist in Dropbox `/root/assets/logo-cashforphilly.png`. Confirm visually against the latest approved master logo before using it. This is an available candidate, not automatic proof that it is the approved final master.
- The existing brand guide refers to `assets/logo/cashforphilly-original.png` as the master source and `assets/logo/cashforphilly-horizontal-email.png` as the narrow header variant.
- Core illustrations named in the previous email composition include `rowhome.png`, `property-search.png`, `cash-coins.png`, `fishtown.png`, `kensington.png`, and `germantown.png`. Other motifs include contract, handshake, rowhome-for-sale, center-city, and calculator where present. Search actual filenames instead of assuming all files exist.

Rules:
1. Read `brand/design-tokens.json` and `brand/brand-theme-guide.md` from this starter kit first if present. The token values quoted below are authoritative even when a ZIP is missing.
2. Extract archives safely; reject entries that escape extraction paths. Preserve the original image files and create optimized web copies to `public/assets/brand/`, `public/assets/neighborhoods/`, and `public/assets/actions/`. Keep a provenance mapping in the manifest.
3. Master logo MUST remain visually unmodified: do not redraw letters, recolor, crop awkwardly, stretch, or create a new imitation. Maintain at least 16 px clear space. Prefer original square lockup when room permits and approved horizontal variant for small widths.
4. Use `image-rendering: pixelated` when upsizing actual low-resolution pixel art; use image dimensions and responsive sources without distorting; do not apply blur/smoothing; optimize with lossless PNG/WebP only when preserving alpha and graphic fidelity. Never store third-party images without permission.
5. At least 6 real original pixel-art illustrations should be used across the built site, if the files exist. Use them selectively with visual rhythm, not 83 icons simultaneously.
6. IMPORTANT: if the essential original master logo and source artwork are absent, finish the code scaffold with clearly marked DEV-ONLY placeholders, explicitly report the missing source paths, and BLOCK production signoff until originals are supplied. Do not report an asset-complete site or produce substitute branded artwork without approval.
7. No trademarks of Philadelphia sports teams, SEPTA, municipal seals or geographic certification claims without permission/review. Brand illustration is not official neighborhood mapping.

## 2. Approved exact design tokens

Use CSS custom properties with these values:

- `--navy: #093963` primary brand, strong text, major CTAs.
- `--navy-deep: #062D4D` footer and dark section backgrounds.
- `--blue: #3D7CAD` highlights and links.
- `--blue-light: #B7E2ED` skyline and illustrations.
- `--blue-tint: #EAF3F8` soft neighborhood blocks.
- `--gold: #EFC547` main promotional CTA; always put NAVY text over gold, NOT white.
- `--gold-dark: #B69745` shadows/borders, not tiny text.
- `--green: #6D993E` illustrated greenery only or restrained positive states.
- `--paper: #FDFDFD` logo/paper background.
- `--canvas: #F3F7FA` outer background.
- `--text: #172B3A` main body copy.
- `--muted: #4D6372` supporting text.
- `--divider: #D9E5EC` subtle borders.

Typography: Inter or a system-sans fallback for web headings and body. Web H1 36-56px responsive, bold; web body 16-18px line-height about 1.55-1.65. Use `Press Start 2P` only in licensed/static artwork or tiny optional decorative labels, never in body paragraphs. In the absence of licensed font files, use an accessible system fallback; never embed downloaded proprietary font assets without an appropriate license.

Spacing: 8px base grid; content sections separated by 24-64px; cards 12px radius; button radius 8px; clickable targets >=44px square; button height normally 48-52px. White/card sections, navy hero, gold primary CTA, pixel skyline/neighborhood cards, soft blue backgrounds. Header should be sticky only if it does not obscure content. Responsive mobile first, no horizontal overflow, generous tap targets.

The 8-bit identity is ornamental, not an excuse to use low-contrast text, inaccessible forms, excessive motion, or bulky images.

## 3. Technical architecture: static-first Astro

Use a minimal, maintainable stack that works with Cloudflare Pages' GIT INTEGRATION:
- Astro with TypeScript, STATIC SSG output (no SSR adapter unless a concrete feature requires it). All content pages should pre-render as static HTML with minimal client-side JS.
- Native CSS custom properties / scoped CSS (Tailwind only if it genuinely reduces complexity; prefer no dependency).
- Cloudflare Pages Functions for the only dynamic API routes; function files live in repository-root `functions/`, not `src/pages/api` and not `dist/`.
- Cloudflare D1 with binding `LEADS_DB` for validated website form submissions; separate local, preview and production DBs or appropriately isolated environments.
- Cloudflare Turnstile with a public sitekey in frontend build-time config and secret in Cloudflare runtime Secrets. Server-side Siteverify verification is MANDATORY; widget-only verification is not adequate.
- GitHub repository connected to Cloudflare Pages using the Cloudflare dashboard Git integration, production branch `main`, preview deployments via PR branches. Do NOT create a Direct Upload Pages project first: an initially Direct-Upload-created project cannot later be switched to Git integration.
- Host website assets locally under `public/assets`; don't rely on third-party stock-asset servers or image hotlinks. Use modern responsive loading, stable aspect ratios, and preserve transparency/pixel rendering.
- Cloudflare Web Analytics can be enabled via the Pages dashboard. Track privacy-safe conversion events; retain UTM campaign attribution in first-party forms only. Do not put email addresses, phone numbers, names, or street addresses in URL parameters.
- No authenticated public administrative interface in v1. Leads will be managed via secured Cloudflare D1 console initially; future API/CRM integration should be a separate, authenticated server-side module.

## 4. User experience and site architecture

Build real, responsive, accessible pages with useful written copy, not blank placeholder sections:

1. `/` - homeowner-focused homepage, brand logo nav, navy hero with the approved headline and gold CTA to `/sell-your-house/`, concise process explanation, recognizable pixel neighborhood illustrations, value propositions without unverifiable claims, CTA near footer, contact link. No fake testimonials, fake urgency or invented offer values.
2. `/sell-your-house/` - primary landing page with reason-to-reach-out scenarios (as-is condition, rentals, inheritance, timing uncertainty), clear three-step process, a secure detailed homeowner lead form, concise honest disclaimer. Headline variation may be tested in future, but choose one coherent message in v1.
3. `/how-it-works/` - practical process: tell us about your property; review the situation; discuss realistic options and next steps. Avoid guaranteed outcomes, no fees promises, or binding offer claims.
4. `/agents/` - separate agent/wholesaler relationship-building page and agent referral/submission intake form. Avoid unapproved commission promises or MLS misuse; allow a clear partner lead category.
5. `/investors/` - verified-opportunities interest landing page. Use a Constant Contact hosted/embedded opt-in form WHEN real embed code is configured; otherwise a conspicuous NOT YET CONFIGURED indicator in preview and clear consent-based contact option; do not pretend an investor is subscribed. Don't show fictional listings.
6. `/areas/` - editorial overview of relevant Philadelphia neighborhoods using EXISTING original Fishtown/Kensington/Germantown/etc. illustrations. Real property photography only when rights and factual property details are supplied. No official boundary map claim.
7. `/about/` - local approach, straightforward process, and business information that is verified. Do not invent a team, business history, brokerage licensing, physical office, statistics or endorsements. Add central content config for unverified identity and licensing disclosures.
8. `/contact/` - monitored mailbox when verified, contact form if enabled, accessible contact alternatives; clearly distinguish marketing signup from one-to-one inquiries.
9. `/privacy/` and `/terms/` - clearly marked drafts requiring an actual legal/business-data review before production. Explain exactly what information is collected, where it is processed, retention, opt-in/opt-out and contact details. Never fabricate a physical address or represent the draft as legal approval.
10. `/thank-you/` - display a genuine confirmation ONLY on successful API storage or actual CC subscription event; no fake "sent successfully" from a frontend-only click.
11. Helpful branded 404 and error/fallback states.

Navigation: Home, Sell a Property, How It Works, For Agents, For Investors, About, Contact. Primary navbar CTA "Explore selling options". Footer includes verified contact information, privacy/terms and relevant required business/licensing identification after verification. Cross-promote other funnels sparingly. English-language site initially. No dark-mode-first design.

Create structured content data modules (`src/data/`) for brand info, CTAs, neighborhood descriptors and FAQs so non-developers can edit wording with minimal effort. All statements must remain supportable. Do not generate SEO doorway pages or thin boilerplate for 48 neighborhoods.

## 5. Forms, lead storage, consent and security

Build real working form components and a POST-only API at `/api/leads` using `functions/api/leads.ts`. Never make a fake successful submission.

Minimum homeowner fields: name, email OR phone (with at least one reliable reply method), property street address or location (where reasonable), city, ZIP, property type, brief message, preferred contact method. Don't make sensitive irrelevant fields required. Agent form should distinguish agent identity, property location, notes. Investor interest uses a separate explicit marketing opt-in path through Constant Contact; no automatic newsletter enrollment from a generic property inquiry.

For D1 create migrations in `db/migrations/` with a `leads` table including: unique id (UUID/string), lead_type (`seller`/`agent`/`contact`), name, normalized email and phone where present, property location, property_type, message, source_path, timestamp, UTM source/medium/campaign/content/term, `marketing_consent` boolean, `marketing_consent_at` nullable, optional separate `sms_consent` boolean/time if SMS will actually be used, status, and a unique idempotency/submission key. Use prepared statements only. Create appropriate indexes. Avoid unnecessary IP tracking/PII collection. Document retention and an access-controlled deletion/export runbook.

Server behavior:
- Validate body type, size/length limits, required fields, field formats, enum values, and allowed site origin. Sanitize for storage/rendering, but prefer safe output encoding and prepared statements. Rate-limit reasonably with available Cloudflare controls; reject malformed and repeated submissions; include a honeypot if useful.
- Verify Turnstile response server side via the official Siteverify endpoint before writing; check both success and expected hostname/action where appropriate. Keep secrets out of git, HTML, JS bundles and build logs. Differentiate staging/production keys.
- Require functioning `LEADS_DB` binding and Turnstile secret for production. On missing config or D1 failure return explicit, safe 5xx and show a meaningful user fallback. Never pretend an unsaved lead has been sent.
- Store consent state separately from inquiry consent. Marketing checkbox must be unchecked by default, optional, and should reference privacy terms. SMS marketing requires its own legally reviewed express consent and should remain disabled until configured. No BrightMLS contact export is automatically permission-based marketing consent.
- Respond with a generic receipt and server-generated id only on confirmed storage. Do not expose raw DB errors or submitted PII to logs. Do not allow public GET/list/admin endpoints for leads.
- Set same-origin request constraints and a restrictive CORS posture; avoid open wildcard CORS. Add no-store cache policy for form responses and sensitive data.
- Create a documented optional notification-provider adapter, disabled until real service credentials and tested delivery are supplied. DO NOT claim Proton or Constant Contact sends serverless transactional notifications by default. Describe how to monitor new leads from D1 until alerts are truly configured.

Constant Contact: create a modular integration point and `docs/constant-contact.md` explaining how to use its approved subscription form embed or official API after configuration. Distinguish subscription from CRM lead capture; do not inject unconfigured placeholder scripts into production; do not expose API credentials client side. Support UTM parameters from campaign email links. Example campaign URL: `https://cashforphilly.com/sell-your-house/?utm_source=constant_contact&utm_medium=email&utm_campaign=cfp_8bit_seller_intro_202610`.

## 6. Accessibility, SEO, performance, security and compliance

- WCAG 2.2 AA-minded markup: landmarks, heading order, explicit labels, validation/error summaries, focus-visible styling, keyboard menus, no color-only errors, readable contrast, alt text reflecting informational role, reduced-motion support, accessible status announcements.
- Search: one unique title/meta description per page, canonical `https://cashforphilly.com`, sitemap.xml, robots.txt, OG metadata using the existing wide marketing graphic where permitted, correct image dimensions, favicon derived from the approved logo (do not deform it). Mark previews noindex via appropriate environment controls; don't index unfinished draft/legal pages.
- Schema.org structured data only for facts verified by operator; omit fabricated reviews, registered-business address, brokerage license details, staff headcount and claimed years of experience.
- CSP and other practical HTTP security headers under `public/_headers` for static pages. Ensure Turnstile and *approved* Constant Contact embed origins are allowed narrowly when those integrations are enabled. Pages Functions responses need their own headers; `_headers` alone does not cover functions.
- Avoid large JS bundles, render-blocking scripts, unnecessary tracking SDKs, animated backgrounds and autoplay. Set explicit width/height and use lazy loading below fold. Aim for Lighthouse scores >=90 Performance and >=95 Accessibility/Best Practices/SEO on representative mobile pages (record actual metrics, do not make them up).
- Keep the site legally neutral and fact-based; add a final launch checklist for Pennsylvania real estate advertising/licensing, Fair Housing compliance, actual company/broker identity where applicable, data privacy, and TCPA/SMS consent if enabled. No unsupported "we are a brokerage" or "we buy homes directly" claims.

## 7. Required repository layout and deliverables

Create a coherent structure approximating (adjust paths if Astro conventions require it):

```
/
  README.md
  package.json
  package-lock.json
  astro.config.mjs
  tsconfig.json
  .gitignore
  .env.example                 # safe public placeholders only; no production secrets
  .github/workflows/ci.yml
  .github/copilot-instructions.md
  src/layouts/BaseLayout.astro
  src/components/{Header,Footer,Hero,CTAButton,ProcessSteps,NeighborhoodCard,LeadForm}.astro
  src/pages/{index,sell-your-house,how-it-works,agents,investors,areas,about,contact,privacy,terms,thank-you,404}.astro
  src/styles/{tokens,global}.css
  src/data/{site,neighborhoods,faqs}.ts
  public/assets/{brand,neighborhoods,actions}/
  public/_headers
  public/_routes.json         # include /api/* only; validate generated output
  public/robots.txt
  functions/api/leads.ts
  db/migrations/0001_create_leads.sql
  tests/{unit,integration,e2e}/
  docs/{asset-manifest,architecture,security,constant-contact,deploy-cloudflare,go-live-checklist,lead-operations}.md
```

If `wrangler.jsonc` is used, ensure its real Pages project name, `pages_build_output_dir`, compatibility date, and D1 IDs match the actual Cloudflare resources. Never ship invented D1 IDs or placeholder secrets in a live configuration. An example config is allowed but must be named `wrangler.example.jsonc` until fully configured.

Scripts expected: `npm run dev`, `npm run check`, `npm run lint`, `npm run test`, `npm run build`, `npm run preview` (the relevant dev/preview path for static Astro; document `wrangler pages dev dist` for Pages Functions). Add dependency lockfile and GitHub Actions CI that uses `npm ci`, checks, tests and builds on pushes/PRs. Do not set up an extra independent deploy workflow if Cloudflare's native Git integration already handles deployment.

README must describe asset ingestion, legal-business config fields, local preview, local function tests, D1 migrations, Turnstile, CC embed, PR previews, production deploy, rollback, lead operations and DNS protection.

## 8. Test-driven acceptance gates

Implement and run a real test suite; report successes and failures with commands/results:

A. `npm ci`, `npm run check`, `npm run lint`, `npm run test`, `npm run build` all pass without suppressed errors.
B. No broken internal links, no missing original assets in release build, no 404s on all intended static routes; correct route rewrites and 404 behavior on Pages.
C. Mobile viewport 360/390/768/1280px, keyboard navigation, form labels, focus order, nav behavior, no horizontal scrolling, representative accessibility audit.
D. Lead API tests for valid submission saved exactly once; malformed payload; missing contact; invalid Turnstile; unconfigured DB; D1 failure; duplicate/idempotency replay; consent unchecked; and malicious strings handled safely.
E. A verified production form submission is retrievable through an authorized D1 query and a user-visible success is shown ONLY afterward. Never test with a real person's data; use designated synthetic sample values and delete test records afterward.
F. Production and preview environment separation for DB and Turnstile credentials. No secrets in repository/build output. Requests to `/api/leads` only hit Functions, not every static asset route; check `_routes.json`.
G. SEO title/meta, canonical, sitemap, OG asset, favicon, robots, and structured data reviewed.
H. Newsletter integration only passes when official CC signup works with explicit consent. Until then, treat it as blocked/incomplete rather than showing a pretend success.
I. Validate HTTP response headers and that Proton/Constant Contact mail-related DNS is unchanged.
J. Create `docs/go-live-checklist.md` with each test's PASS/BLOCKED/FAIL state and list any fields the owner must verify.

## 9. Deployment: produce a REAL Cloudflare Pages Git-based project, not a fake link

Execution order:
1. Inspect repository and brand archives. Show a concise execution plan, then implement real code and tests. Do not stall at planning.
2. Ask only if a blocking fact is missing (the brand archives, permissions, or business/legal identity); otherwise use clear TODOs without fabricating facts.
3. Run unit/integration/build checks, fix failures, and inspect local render. Commit meaningful changes to a feature branch for review if a remote exists. If no repo exists, prepare the code for a NEW private `therealvillar/cashforphilly-site` repository and provide commands or create it only where authenticated access and explicit write authorization exist. Never push credentials or source-asset archives containing confidential material.
4. For Cloudflare Pages Git integration, use the dashboard: Workers & Pages -> Create application -> Pages -> Import an existing Git repository -> select `cashforphilly-site`. Authorize the Cloudflare GitHub app if needed. Select `main` as production, `npm run build` as build command, `dist` as output folder, and `/` as repo root. Check for changed Cloudflare UI labels; use the current official Cloudflare Pages instructions. The first deployment should yield a real `*.pages.dev` preview.
5. DO NOT use `wrangler pages project create` or direct-upload deployment as the FIRST creation step when the intent is a Git-connected Pages project. Initial Direct Upload projects cannot later switch to native Git integration. Wrangler is appropriate for local dev, D1 migrations, secrets where supported, and management after project mode is established.
6. Cloudflare: create separate D1 DB `cashforphilly-web-leads` (and isolated preview DB where practical); run migrations; bind `LEADS_DB` via Pages project Settings -> Bindings for production/preview; add `TURNSTILE_SECRET_KEY` as a secure runtime Secret; configure allowed Turnstile hostnames and public site key at build time; configure any other required public values without exposing private credentials. Redeploy as necessary for bindings to take effect.
7. Validate `https://<actual-project>.pages.dev` functionality first, including real API storage and lead operations. Then open Pages project -> Custom domains -> Set up a domain -> connect `cashforphilly.com` and optionally `www.cashforphilly.com`, redirect secondary host to canonical. Confirm existing Cloudflare zone and nameserver configuration before changing anything.
8. Before or after domain cutover as appropriate, capture DNS record snapshot and preserve ALL Proton MX/SPF/DKIM/DMARC records and Constant Contact authentication records. Only alter website-related A/AAAA/CNAME/Cloudflare Pages routes as necessary. Confirm `contact@cashforphilly.com` mail receipt still works.
9. Final production browser smoke test: pages, logo/assets, mobile, sitemap, canonical/SSL, actual D1 form persistence, Turnstile hostname, analytics, CC signup (only if configured), and mail receipt. If any acceptance gate fails, report BLOCKED and do not claim that production is ready.
10. Produce deployment report with the GitHub repo URL, commit SHA, actual Cloudflare Pages project URL, custom-domain status, build logs/results, functional test outcomes, any unfinished integrations, and explicit manual actions. NEVER INVENT URLS, test results or successful deployments.

Official Cloudflare references:
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/functions/get-started/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/pages/functions/routing/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/d1/platform/pricing/

## 10. Final response contract

Do not stop after generating code. Continue through tests, corrections and deployment preparation. At the end, output four concise sections: (1) files/features built; (2) verification matrix with real test results; (3) deployment status with actual URLs only; (4) actionable blockers/owner approvals. Avoid exaggerated marketing language and do not request paid products unless absolutely necessary. Protect the owner's existing Cloudflare/Proton DNS records and keep the base project viable on free hosting.
