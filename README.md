# TravelTracker

A Progressive Web App (PWA) walk and travel tracker powered by MapTiler. Works entirely in the browser, installable on Android via "Add to Home Screen".

## Features

- **GPS Tracking** — Start/stop walk recording with live route drawn on map
- **MapTiler Maps** — Outdoor, Streets, and Satellite base styles with Buildings overlay
- **Geocoding** — Reverse geocoding shows current street name; forward geocoding with autocomplete search
- **Elevation Profile** — Real-time elevation during walks; SVG elevation chart for past sessions
- **Session History** — IndexedDB persistence; tap to replay route with start/end markers
- **Sharing** — Generate static map images via MapTiler Static Maps API
- **Weather Overlay** — Precipitation and cloud layer toggle
- **Offline** — Service worker caches app shell; works offline after first load

## Quick Start

1. **Get a MapTiler API key** at https://cloud.maptiler.com
2. Copy `.env.example` to `.env` and paste your key:
   ```bash
   cp .env.example .env
   # edit .env and set MAPTILER_API_KEY=your_key
   ```
3. Generate `config.js` from `.env`:
   ```bash
   chmod +x setup.sh && ./setup.sh
   ```
4. Serve with any static HTTP server:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```
5. Open in Chrome, accept location permission, start walking

## File Structure

```
.env              — Your API key (gitignored, never committed)
.env.example      — Template for .env
setup.sh          — Generates config.js from .env
config.js         — Generated, loaded by index.html (gitignored)
index.html        — Full app UI and JavaScript logic
sw.js             — Service worker for offline caching
manifest.json     — PWA manifest for "Add to Home Screen"
icon-192.png      — App icon (192×192)
icon-512.png      — App icon (512×512)
```

## Tech Stack

- Vanilla HTML + CSS + JavaScript (single file, no build step)
- [MapTiler SDK JS v2](https://docs.maptiler.com/sdk-js/) via CDN
- [idb](https://github.com/jakearchibald/idb) for IndexedDB
- Service Worker API for offline support

## MapTiler APIs Used

| API | Endpoint |
|-----|----------|
| Maps | `api.maptiler.com/maps/{style}/style.json` |
| Geocoding | `api.maptiler.com/geocoding/{query}.json` |
| Reverse Geocoding | `api.maptiler.com/geocoding/{lng},{lat}.json` |
| Elevation | `api.maptiler.com/elevation/point` / `elevation/lines` |
| Static Maps | `api.maptiler.com/maps/{style}/static/auto/...` |
| Buildings | `api.maptiler.com/tiles/buildings/tiles.json` |
| Weather | `api.maptiler.com/weather/precipitation` / `weather/clouds` |
