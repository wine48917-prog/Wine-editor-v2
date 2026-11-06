# WINE EDITOR v3.0 — Installable foundation

This update adds the Progressive Web App (PWA) foundation: install metadata, app icons, an install prompt, and a service worker for caching the app shell. The existing photo editor and optional fal.ai endpoints are preserved.

## Deploy to Vercel
1. Extract this ZIP.
2. Upload/replace the project files in the root of the GitHub repository (keep `api/` and `icons/` folders).
3. Commit and push; Vercel should deploy from the connected repository.
4. Open the deployed site over HTTPS. On supported browsers, use the install prompt or browser menu → Install app / Add to Home Screen.

## Important
- This is the installable app foundation, not a finished CapCut-equivalent editor yet. Video timeline, multi-track editing, audio mixing, transitions, and video export are the next development stages.
- The app shell can be cached for offline opening, but AI/API features and external fonts require a connection.
- AI editing uses fal.ai and may incur usage charges. Keep `FAL_KEY` private in Vercel; do not put it in frontend files. Add authentication and rate limiting before public launch.
- The current photo editor remains available.
