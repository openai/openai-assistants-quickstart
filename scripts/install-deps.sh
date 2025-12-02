#!/usr/bin/env bash
set -euo pipefail

# Optional: override the registry (useful behind proxies or private mirrors)
REGISTRY="${REGISTRY:-https://registry.npmjs.org}"

if [[ -n "${REGISTRY}" ]]; then
  echo "Using npm registry: ${REGISTRY}" >&2
  export NPM_CONFIG_REGISTRY="${REGISTRY}"
fi

echo "Cleaning npm cache..." >&2
npm cache clean --force >/dev/null

echo "Installing dependencies..." >&2
npm install --no-progress --no-fund --no-audit "$@"

echo "Done." >&2
