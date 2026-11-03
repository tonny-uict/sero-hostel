# SERO Hostel & Rental website

Static site. No build step. Open `index.html` through any web server, or deploy as is (see DEPLOYMENT.md).

## Files

- `index.html`, `styles.css`, `script.js` the whole site
- `images/` the seven property photos, converted to WebP (about 0.7 MB in total, down from 11.6 MB)
- `fonts/` Bricolage Grotesque, self-hosted so the page loads fast on mobile data
- `vercel.json`, `.nojekyll` hosting config

## Things you will want to edit

All in `script.js`, in the "Settings" block at the top:

- `WHATSAPP_NUMBER` the number every WhatsApp button opens
- `MAP_DEFAULT` the place the map opens on. Once you have the exact address or a pin, put it here (for example `0.3400,32.6300`) and the map will centre on it

In `index.html`:

- Phone numbers: search for `+256`
- Room descriptions and the tour captions: search for `data-text` (tour) and the `ROOMS` list in `script.js` (rooms)
- Social preview image: change `og:image` to the full web address of `images/og.jpg` after deploying

## What is not on the site, on purpose

No prices, street address or verified map pin were supplied, so none are shown. Rates are "on request". Add them in `ROOMS` and the `.rate` block when you are ready.
