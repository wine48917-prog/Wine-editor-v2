# WINE EDITOR V2 — Creative Studio

Arabic-first, mobile-friendly photo and video editor.

## Included
- Photo editor: brightness, contrast, saturation, warmth, filters, aspect ratios, text, rotation, flip, vignette, undo/redo, before/after, PNG export.
- Advanced photo tools: local color picker, color-key transparency removal, and 2x/3x/4x canvas upscale export.
- Video editor: local video preview, trim range, playback speed, color filters/adjustments, optional music, and WebM export where supported by the browser.
- WINE copyright footer.

## Important limitations
- Color-key background removal is a local color-matching tool, not AI segmentation. It works best on plain, evenly colored backgrounds.
- Upscaling increases pixel dimensions using browser canvas interpolation; it does not generate new AI detail.
- AI background removal and true AI super-resolution require a configured external service/API. No API key is included in this front-end package.
- Video export depends on browser MediaRecorder/captureStream support and typically produces WebM.

## Deploy
Replace only `index.html`, `styles.css`, and `app.js` in the existing GitHub project. Keep the existing `api/` folder and Vercel environment variables/configuration untouched. Commit and let Vercel redeploy.
