# WINE EDITOR v2.1 — AI editing enabled

## Included
- Original WINE EDITOR v2.0 tools
- Real image-to-image editing via fal.ai `fal-ai/glm-image/image-to-image`
- Vercel serverless endpoints under `/api`
- API key stays server-side; supports the existing Vercel variable `fal_key` (and `FAL_KEY`)
- Queue submit + status polling so the browser does not hold a long-running server request

## Vercel environment variable
The project reads `fal_key` first, then `FAL_KEY`. Keep the value private. Ensure it is enabled for the Production environment. After changing environment variables, redeploy.

## Deploy
Upload the contents of this folder to the root of the connected Git repository and commit/push. Vercel will deploy automatically. Do not upload the ZIP as a single file to the site root; extract it and preserve the `api/` folder.

## Notes
The AI endpoint accepts JPG, PNG, and WEBP data URLs up to roughly 2.5 MB. Image editing is billed by fal.ai according to the selected model/account pricing. Add authentication and rate limiting before opening this endpoint to the public to prevent abuse and unexpected usage charges.
