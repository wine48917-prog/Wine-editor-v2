# WINE EDITOR — Video Studio MVP

This package contains the existing WINE photo editor plus a first working browser-based video editor module.

## Included
- Existing photo editing: brightness, contrast, saturation, warmth, filters, aspect ratios, text overlay, undo/redo and PNG export.
- Video editor: import one local video, preview/playback, playback speed, seek, set trim-in/trim-out, optionally add a music file, and export the selected segment as WebM using the browser MediaRecorder API.
- Responsive layout for desktop and mobile.

## Run locally
Open `index.html` in a modern browser, or serve this folder with any static web server. For best video export support use an up-to-date Chrome or Edge over HTTPS or localhost.

## Deploy to Vercel
1. Upload/replace `index.html`, `styles.css`, `app.js`, and `README.md` in the same GitHub project folder.
2. Commit and push the changes.
3. Wait for Vercel to finish the deployment, then refresh the live site.

## Important limitations of this build
This is a functional first video-editing milestone, not full CapCut parity yet. It currently edits one video clip at a time. It does not yet provide multi-track editing, transitions, keyframes, captions, effects, or frame-accurate professional rendering. WebM export and audio mixing depend on browser support and available device resources. AI editing remains dependent on a separately configured secure backend/API.
