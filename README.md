# WINE EDITOR v2.0

Mobile-first photo editor prototype.

## Files
- `index.html` — app structure and embedded VELOR brand mark
- `styles.css` — responsive visual system
- `app.js` — client-side editing tools

## Included
Image upload, brightness/contrast/saturation/warmth, looks, filters, aspect presets, text overlay, undo/redo snapshots, reset, before/after toggle, PNG export.

## AI editing
The AI panel is a UI placeholder only. It does not call fal.ai yet. Add a server-side API route that reads the Vercel environment variable `fal_key` before enabling real AI requests. Never expose the key in browser JavaScript.

Deploy these files to the root of the Vercel project.
