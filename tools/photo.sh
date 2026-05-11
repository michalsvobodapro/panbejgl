#!/usr/bin/env bash
# Photo workflow helper for Pan Bejgl.
#
# Compress + resize a photo and copy it into images/ with a clean name.
# Optionally also append it to content.json's "gallery" array.
#
# Usage:
#   tools/photo.sh add <source-file> <slug> [caption]
#     Compress + resize, save as images/<slug>.jpg, append to gallery.
#     Example: tools/photo.sh add ~/Downloads/IMG_1234.jpg vajicko-bagel "Vajíčkový poctivec"
#
#   tools/photo.sh add-only <source-file> <slug>
#     Same as 'add' but do NOT touch content.json (just compress + copy).
#
#   tools/photo.sh list
#     Show current gallery contents from content.json.
#
# Runs at repo root.

set -euo pipefail

cd "$(dirname "$0")/.."
ROOT=$(pwd)

usage() {
  grep '^#' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

compress_into_images() {
  local src="$1"
  local slug="$2"
  if [[ ! -f "$src" ]]; then
    echo "Source file not found: $src" >&2; exit 1
  fi
  local dst="images/${slug}.jpg"
  cp "$src" "$dst"
  sips -Z 1400 -s formatOptions 70 "$dst" > /dev/null
  echo "→ Saved: $dst ($(du -h "$dst" | cut -f1))"
}

append_to_gallery() {
  local slug="$1"
  local caption="${2:-}"
  python3 - "$slug" "$caption" <<'PY'
import json, sys, pathlib
slug = sys.argv[1]
caption = sys.argv[2]
p = pathlib.Path("content.json")
c = json.loads(p.read_text(encoding="utf-8"))
c.setdefault("gallery", []).append({"src": f"images/{slug}.jpg", "caption": caption})
p.write_text(json.dumps(c, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"→ content.json gallery: appended {{src: images/{slug}.jpg, caption: '{caption}'}}")
PY
}

cmd="${1:-help}"
case "$cmd" in
  add)
    src="${2:-}"
    slug="${3:-}"
    caption="${4:-}"
    [[ -z "$src" || -z "$slug" ]] && usage
    compress_into_images "$src" "$slug"
    append_to_gallery "$slug" "$caption"
    ;;
  add-only)
    src="${2:-}"
    slug="${3:-}"
    [[ -z "$src" || -z "$slug" ]] && usage
    compress_into_images "$src" "$slug"
    ;;
  list)
    python3 -c "import json; c=json.load(open('content.json')); [print(f'{i+1:>2}. {g[\"src\"]:<32} {g.get(\"caption\",\"\")}') for i,g in enumerate(c.get('gallery',[]))]"
    ;;
  *)
    usage
    ;;
esac
