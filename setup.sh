#!/bin/sh
# Generates config.js from MAPTILER_API_KEY.
# Locally: reads .env. On Vercel/CI: reads the env var from the environment.
set -e
if [ -f .env ]; then
  . ./.env
fi
if [ -z "${MAPTILER_API_KEY}" ]; then
  echo "Error: MAPTILER_API_KEY not set. Create a .env file or set the env var."
  exit 1
fi
cat > config.js <<EOF
window.API_KEY = '${MAPTILER_API_KEY}';
window.TOMTOM_KEY = '${TOMTOM_API_KEY:-}';
EOF
echo "Generated config.js"
