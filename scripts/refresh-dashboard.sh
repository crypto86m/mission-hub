#!/bin/bash
# Refresh Mission Control dashboard data
# Called by heartbeat (Tier 2/3) every 30min-2hr
# Regenerates status.json with live Alpaca data + copies to dist/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Refreshing dashboard data..."

# 1. Regenerate status.json with live trading data
python3 "$SCRIPT_DIR/generate-status.py"

# 2. Copy to dist/ for Vercel serving
cp "$PROJECT_DIR/public/api/status.json" "$PROJECT_DIR/dist/api/status.json" 2>/dev/null || true
cp "$PROJECT_DIR/public/api/tasks.json" "$PROJECT_DIR/dist/api/tasks.json" 2>/dev/null || true

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Dashboard data refreshed ✅"
