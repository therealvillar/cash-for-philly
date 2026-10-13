# Constant Contact | CashForPhilly activation guide

## Status
Pack and local HTML example prepared. **Not uploaded to Constant Contact, no campaign created, no emails sent.** Campaign objective/audience/CTA must be confirmed before creating a live draft.

## 1. Prepare your online funnel
1. Pick exactly one audience and one conversion: (a) owners requesting a property offer, (b) agents sending a referral, or (c) investors requesting current opportunities.
2. Verify `https://cashforphilly.com/` is live and the chosen action goes to a real lead form or landing page. Do not assume the domain's home page is a conversion page.
3. Create UTM-coded links as needed: `?utm_source=constant_contact&utm_medium=email&utm_campaign=cfp_8bit_seller_intro_202610` (append with `&` if a query string already exists).
4. Make sure your outreach list has documented marketing permission. Bright MLS export records or imported agent contacts are not automatically opt-in subscribers.

## 2. Upload the graphics to Constant Contact Library
1. Log into Constant Contact.
2. Open **Assets > Library** from the navigation.
3. Click **Upload > My Computer**.
4. Unzip the kit locally and select `assets/logo/cashforphilly-horizontal-email.png` plus these seven primary icons: `rowhome.png`, `property-search.png`, `cash-coins.png`, `fishtown.png`, `kensington.png`, `germantown.png`. Those are the only six image assets besides the logo needed for the example.
5. If prompted, put files into a folder named `CashForPhilly / 8bit / email-2026` and add descriptive text. Click **Upload Files**, then **Done**.
6. Keep each uploaded file under Constant Contact's supported upload limit (the included campaign assets are significantly smaller).

## 3. Create the email
1. Go to **Channels > Emails** (some accounts show **Emails** at top-level).
2. Click **+ Create an email**.
3. Choose **Paste your own code / Paste HTML code**. If offered an automatic conversion to a visual editor, prefer retaining the Custom Code view for exact layout.
4. Name the campaign clearly, e.g. `CFP | Sellers | 8-bit Philly | 2026-10 | V1`.
5. Set the subject and preheader in **Email settings**; example subject `Your Philly property, your next move` and preheader `Explore property-selling options, with a local conversation first.`
6. Open `email/constant-contact-custom-html.html` in VS Code and paste its HTML into the code editor. **Do not use `preview-local.html` inside Constant Contact** because it points to local files.
7. For each `{{..._URL}}` placeholder, put your cursor on the value of that image's `src` and use **Insert > Images**; choose its uploaded My Library image and click **Insert**. Use the inserted image URL to replace the placeholder so you don't overwrite the surrounding HTML by accident. For all seven URLs, verify none of the placeholders remain.
8. Edit the two CTA links in the HTML to the real campaign landing page, preferably with UTMs.
9. Confirm the correct company sender identity and an actively monitored reply-to mailbox.

## 4. Test, then send only when ready
1. Use the Custom Code **Live Preview**, and then **Check & Preview > Preview**.
2. Send a test to Gmail desktop/mobile, Outlook Windows, iOS Mail. Check broken images, scaling, white backgrounds, dark mode, body text, and footer.
3. Disable images in a test email. Headline, steps, CTA, and all essential information must still work.
4. Confirm account physical mailing address, privacy info, and automatic unsubscribe footer. Constant Contact appends required footer for marketing emails.
5. Run links through a tracking test. Check destination page and form capture on mobile and desktop.
6. Send only to the segment with the right subscription/permission status. Avoid dumping all BrightMLS/Contacts+ contacts into one marketing list.

## 5. Performance plan
- **A/B test subject**: `Your Philly property, your next move` vs `Considering selling a Philly property?`.
- **Primary metric**: unique click-through to offer/referral/info landing page.
- **Secondary**: qualified form leads / replies, landing-page conversion, unsubscribe and spam complaint rates.
- **Time-series storage**: save CC campaign activity ID + send time + segment ID + UTM campaign alongside conversion events in your CRM/database. Avoid unnecessary transmission of recipient PII in URL query strings.
- **Iteration**: Change one element at a time: subject, CTA copy, hero background, icon panel, or send segment. Don't conflate opens with delivered messages; open tracking is noisy due to privacy features.

## Campaign variants

### A. Homeowners / property sellers (included local preview)
**Subject:** Your Philly property, your next move
**Offer:** Talk about an as-is property, timing, condition and potential paths.
**CTA:** Explore selling options (to the verified inquiry landing page).
**Artwork:** rowhome, search, coins, Fishtown/Kensington/Germantown.

### B. Agents and wholesalers / relationship-building
**Subject:** Have a Philly property that needs a buyer?
**Offer:** Discuss a candidate acquisition or buyer introduction; do not imply a commission promise without approved terms.
**CTA:** Submit a property (to verified partner-intake form).
**Artwork:** contract, handshake, rowhome-for-sale, property-search.

### C. Investors / neighborhood digest
**Subject:** This week's Philadelphia property watchlist
**Offer:** Neighborhood market context and actual verified opportunities, with exact dates and sources.
**CTA:** See current opportunities (to verified listings page).
**Artwork:** center-city, kensington, fishtown, calculator; real property photos and dates for any particular listing.

## Reference documentation
- https://knowledgebase.constantcontact.com/email-digital-marketing/tutorials/KnowledgeBase/34400-Build-an-email-with-HTML-in-the-Custom-Code-editor?lang=en_US
- https://knowledgebase.constantcontact.com/email-digital-marketing/articles/KnowledgeBase/5317-Upload-an-image-to-your-Library?lang=en_US
- https://knowledgebase.constantcontact.com/email-digital-marketing/articles/KnowledgeBase/34515-Add-an-image-to-a-custom-code-email?lang=en_US
