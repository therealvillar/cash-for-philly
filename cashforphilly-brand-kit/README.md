# CashForPhilly | 8-bit Marketing Brand Kit

**Source of truth:** The supplied `logo-cashforphilly.png` remains the main logo. This kit uses exact pixels cropped and isolated from the eight supplied files for reusable transparent PNG artwork.

## Deliverables

- `assets/logo`: original logo, tight transparent logo, emblem, wordmark, email-friendly horizontal lockup.
- `assets/icons/neighborhoods`: 48 *curated* Philadelphia neighborhood and local-place illustrations, each a separate transparent 256 × 256 PNG. Selected icons also have 512-pixel renditions.
- `assets/icons/property-actions`: a set of real-estate process and property illustrations (house, repairs, offer, valuation, money, contracts, etc.).
- `assets/icons/alternates`: intermediate sheets and variants preserved for design options; may repeat some motifs. Refer to manifest.
- `assets/icons/restricted`: visual references that resemble trademarked brands or public artwork; **not approved for unlicensed commercial use**.
- `catalog/`: contact sheets and a CSV/JSON manifest with source provenance.
- `email/preview-local.html`: open locally for a full email preview, works without hosting (local relative images).
- `email/constant-contact-custom-html.html`: use in Constant Contact only **after replacing all `{{IMAGE_URL}}` variables with online image URLs from Constant Contact Library**.
- `email/constant-contact-api.html`: same template including the API-required `[[trackingImage]]` token; **not needed for the manual editor workflow**.
- `guides/`: design tokens and Constant Contact setup / campaign playbook.

## Important quality notes

1. The original neighborhood boards contain typo-riddled and repeated labels. The 48 curated images have the name text removed from the image and restored as verified, editable filenames and captions. The artwork alone does not assert official neighborhood boundaries.
2. Source pixel art is approximately 100–300 pixels wide per illustration, so a 512px export scales it cleanly but cannot create genuine extra illustration detail.
3. Icons are cutouts, **not vector graphics**. Preserve pixel appearance and transparency; do not use image-to-SVG tracing and assume semantic accuracy.
4. The square master logo and its wordmark come from the final supplied reference. Do not use the generated mood-board image as a replacement: it is a concept mockup, not source-of-truth branding.
5. Some illustrations evoke team, transit, or landmark trademarks. Those have been separated into `restricted`.
6. This is a design kit and **a campaign example**, not a live email or approved marketing list. Nothing was sent.

## Suggested campaign systems

- **Property-owner outreach**: rowhome / as-is / review / offer sequence. Main goal: qualified website inquiry. Use only opted-in recipients.
- **Agent/wholesaler partnerships**: property valuation, contracts, repair tools. Main goal: submit a property or reply with a referral.
- **Investor neighborhood digest**: use three neighborhood cards and up-to-date, cited inventory snapshots. Main goal: view verified listings / reply for analysis. Do not invent property inventory or returns.

## Preparation

1. Review the `catalog/neighborhoods-preview.png` and `catalog/property-actions-preview.png` contact sheets.
2. Select 5–8 campaign assets. Do not load every icon into one email.
3. Verify domain, real CTA URL, actual business address, opt-in list, and brand wording.
4. Upload selected PNGs to Constant Contact My Library (see setup guide).
5. Paste custom HTML and replace image placeholders with Constant Contact public hosted image links.
6. Run desktop, mobile, and dark-mode testing. Send tests to Gmail, Outlook, and iOS Mail.
