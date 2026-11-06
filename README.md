# WINE EDITOR — Photo + Video Studio

## What's included
- Photo editor: brightness, contrast, saturation, warmth, quick looks, crop ratios, text overlay, undo/redo, before/after, PNG export.
- Expanded photo filter presets: Original, Mono, Golden, Arctic, Vintage, Drama, Rose, Matte, Emerald and Noir.
- Video editor: local video preview, trim in/out, playback speed, eight live color looks, brightness/contrast/saturation, optional background audio, WebM export where supported.
- Responsive dark UI and copyright footer for WINE EDITOR.

## Deploy
Replace `index.html`, `styles.css`, and `app.js` in the existing GitHub project. Keep existing `api/`, environment variables, and deployment configuration. Commit the changes and let Vercel deploy.

## Notes
Video export uses browser MediaRecorder and WebM; browser/device support and performance vary. This is a browser-based single-clip editor, not yet a full multi-track NLE. AI editing requires a separately configured secure backend and valid provider key; never put API secrets in frontend files.
