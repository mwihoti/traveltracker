#!/bin/sh
# Generates config.js from .env
set -e
if [ ! -f .env ]; then
  echo "Error: .env file not found. Copy .env.example to .env and set your API key."
  exit 1
fi
. .env
cat > config.js <<EOF
window.API_KEY = '${MAPTILER_API_KEY}';
EOF
echo "Generated config.js from .env"
