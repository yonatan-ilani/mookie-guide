#!/usr/bin/env bash
# Rebuild every sitter page from index.html.
# Each line in SITTERS: slug|names shown in the greeting|poster path (empty = no poster)
set -euo pipefail
cd "$(dirname "$0")/.."

SITTERS=(
  "lior|ליאור|assets/lior-poster.jpg"
  "noa-yuval|נועה ויובל|"
)

for row in "${SITTERS[@]}"; do
  IFS='|' read -r slug names poster <<<"$row"
  sed -e "s|<meta name=\"sitter-names\" content=\"\">|<meta name=\"sitter-names\" content=\"$names\">|" \
      -e "s|<meta name=\"sitter-poster\" content=\"\">|<meta name=\"sitter-poster\" content=\"$poster\">|" \
      index.html > "$slug.html"
  # only the two meta lines may differ from index.html
  changed=$(diff index.html "$slug.html" | grep -c '^<' || true)
  [ "$changed" -le 2 ] || { echo "$slug.html differs in more than the meta lines" >&2; exit 1; }
  if [ -n "$poster" ] && [ ! -f "$poster" ]; then echo "missing $poster" >&2; exit 1; fi
  echo "built $slug.html"
done
