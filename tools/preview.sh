#!/usr/bin/env bash
# Start a local server and open the site in a browser.
# Usage: tools/preview.sh

set -euo pipefail
cd "$(dirname "$0")/.."

PORT=8123
# Kill any existing server on this port
lsof -ti:$PORT 2>/dev/null | xargs kill 2>/dev/null || true
sleep 0.3

python3 -m http.server $PORT > /tmp/panbejgl-server.log 2>&1 &
echo $! > /tmp/panbejgl-server.pid
sleep 1
echo "Server running at http://localhost:$PORT"
echo "(log: /tmp/panbejgl-server.log, pid: $(cat /tmp/panbejgl-server.pid))"
open "http://localhost:$PORT?ts=$(date +%s)"
