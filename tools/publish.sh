#!/usr/bin/env bash
# Stage all changes, commit with a message, push to GitHub.
# Pages rebuilds within ~1 min.
#
# Usage:
#   tools/publish.sh "Update menu prices and add new photos"

set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:-Update site content}"

# Validate JSON before pushing — prevents broken deploys.
python3 -m json.tool content.json > /dev/null || { echo "content.json is invalid JSON — aborting"; exit 1; }

git add -A
if git diff --cached --quiet; then
  echo "Nothing to commit."
  exit 0
fi

git status --short
echo ""
echo "Committing: $MSG"
git commit -m "$MSG

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
git push
echo ""
echo "Pushed. GitHub Pages will rebuild in ~30-60s."
echo "Live URL: https://michalsvobodapro.github.io/panbejgl/"
