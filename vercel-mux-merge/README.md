# Vercel Mux Merge API

This small project exposes 3 endpoints on Vercel to merge a Reddit video-only + audio-only pair **using Mux** (no ffmpeg needed).

## Endpoints

1) `POST /api/mux/create`
   Body JSON:
   ```json
   { "videoUrl": "https://...", "audioUrl": "https://...", "makeMp4": true }
   ```
   Returns `{ assetId, playbackId }`.

2) `GET /api/mux/status?id=ASSET_ID`
   Returns processing status. When `status` is `ready`, you also get:
   - `hls` .m3u8 url
   - `mp4` when static rendition is ready (if you asked for it).

3) `POST /api/mux/mp4`
   Body JSON:
   ```json
   { "assetId": "..." }
   ```
   Triggers creation of a static MP4 ("highest") for an existing asset.

## Environment variables (set in Vercel Project → Settings → Environment Variables)
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`

## Deploy (two ways)

**A) With the Vercel CLI**
```bash
npm i -g vercel
vercel deploy --prebuilt
```

**B) Import on vercel.com**
1. Create a new project, "Import" from your repo or drag-drop these files.
2. Add the two MUX env vars.
3. Deploy.

## Notes
- We ask Mux to ingest **two inputs**: the video-only URL and the audio-only URL. Mux merges them server-side.
- If Reddit blocks direct fetch by Mux (rare), first download to your own storage and pass those URLs to Mux.
