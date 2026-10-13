# CashForPhilly | Brand guidelines v1

## Identity
Philadelphia real estate experience represented with recognizable 8-bit imagery. Use authentic brand assets with modern, readable communication. The final uploaded image is the master brand mark.

## Brand palette
| Token | HEX | Use |
| --- | --- | --- |
| navy | `#093963` | Primary brand, text and primary CTA |
| navy_deep | `#062D4D` | Dark footer/section accents |
| blue | `#3D7CAD` | Secondary highlights and links |
| blue_light | `#B7E2ED` | Illustrated skyline and accents |
| blue_tint | `#EAF3F8` | Neighborhood block background |
| gold | `#EFC547` | Primary marketing accent or promotional CTA |
| gold_dark | `#B69745` | Gold shadows and borders; avoid for small body text |
| green | `#6D993E` | Illustrated trees only, occasional success accent |
| paper | `#FDFDFD` | Logo background / white paper |
| canvas | `#F3F7FA` | Surrounding email background |
| text | `#172B3A` | Long-form paragraph body |
| muted | `#4D6372` | Supporting text |


## Hierarchy
- **Logo:** Use original square when size allows; for narrow email headers, use horizontal cropped-composite. Leave at least 16px whitespace around.
- **Display:** Press Start 2P for small graphic labels of 2–5 words; only embed in static PNG assets if licensed. Do **not** make all copy pixel-text.
- **Headings:** 28–38px Arial/Helvetica bold in email; 36–56px Inter extra-bold on web.
- **Body:** 15–17px Arial/Helvetica, line-height 1.5–1.6, dark navy-gray; avoid white text on sky blue.
- **Small copy:** 12–13px minimum, including footer. Preheader hidden text is permitted for inbox summary.
- **Links:** Underline inline links; button CTA accessible contrast and obvious shape.

## Space and shape
- Base spacing 8px. Use 16/24/32px between related/unrelated sections.
- Email width: 640px desktop, fluid on mobile. Content horizontal padding: 34px desktop / 22px mobile.
- Cards: 12px radius; buttons: 8px radius; card gutters 12–16px; 1px #D9E5EC dividers.
- CTA size: 48–52px tall, minimum 44x44px touch area. Gold promotional background (#EFC547) with navy text (#093963).
- Icons: 96–112px displayed in email with 256px source for density. Cap marketing email to 5–8 icon illustrations.

## Image use
- Do not upscale an image via smoothing. Use nearest neighbor to preserve pixel blocks. Keep subject padding inside icon canvases.
- Use editorial text **outside** the images so spelling, accessibility, translation, and live personalization work.
- Use a real property photograph when advertising a specific property; illustrated neighborhood assets are a brand supplement, not proof of a listing.
- Do not claim these icons show official Philadelphia boundary shapes or government affiliation.
- Important: sports marks and transit/municipal emblems may require license or legal review.

## Email design architecture
- Thin gold brand bar > white logo header > navy hero > prominent gold CTA > three-step cards > neighborhood illustration row > second CTA > plain business footer.
- Keep text readable even with images blocked. Every substantial CTA is plain HTML text, not part of a PNG.
- Keep one campaign objective, one core CTA. Repeat primary CTA at most twice for a 640px / ~1200px email.
- Use a dynamic but readable mobile stack; three columns should become single columns.
- Avoid text-only images, large attachments, autoplay content, JavaScript, and custom webfonts in HTML email.

## Accessibility and email QA
- Verify gold on navy, navy on white, white on navy contrast. White on gold is not the chosen CTA scheme.
- Images need accurate alternative text. Purely decorative images can use empty alt.
- Use a real sender identity and reply-to address; ensure SPF, DKIM, and DMARC alignment for the sending domain.
- Ensure one-click unsubscribe as supported by the platform, privacy policy, physical address, and confirmed subscription basis.
