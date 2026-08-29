#!/usr/bin/env bash
# Build the site and overlay it onto the live `published` branch worktree.
#
# GitHub Actions is billing-locked, so `published` is the production tree and it
# has to be updated by hand after every content change. Doing that by hand is
# how the homepage teasers, the /news/ hub, the sitemap, and the machine catalogs
# end up stale while the new article itself looks fine. This script copies all of
# them together and refuses to finish if the homepage does not list the newest
# item.
#
# Usage:
#   script/ship-live.sh                 # build, overlay, verify
#   script/ship-live.sh --push          # also push to origin/published
#   script/ship-live.sh --push --purge  # also purge Cloudflare (needs CLOUDFLARE_API_TOKEN)
#
# --push also submits the URLs this ship changed to IndexNow (Bing, Yandex,
# Seznam), which is the only way new pages get picked up quickly while GitHub
# Actions is billing-locked. Pass --no-indexnow to skip it.
#
# Env:
#   PUBLISHED_WORKTREE  path to the `published` worktree (default /tmp/logbook-published)
#   BUILD_DIR           build destination (default /tmp/logbook-prod-site)
#   CF_ZONE_ID          Cloudflare zone for --purge (default the logbook.rocks zone)
#   INDEXNOW_KEY        IndexNow key (default the key published at the site root)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLISHED_WORKTREE="${PUBLISHED_WORKTREE:-/tmp/logbook-published}"
BUILD_DIR="${BUILD_DIR:-/tmp/logbook-prod-site}"
CF_ZONE_ID="${CF_ZONE_ID:-bb0257be09f261a3c9b40a5d7f55c586}"

DO_PUSH=0
DO_PURGE=0
ALLOW_BEHIND_MAIN=0
DO_INDEXNOW=1
INDEXNOW_KEY="${INDEXNOW_KEY:-c8e4f0a1b2d39567e8f1a0c4b7d6e529}"
for arg in "$@"; do
  case "$arg" in
    --push) DO_PUSH=1 ;;
    --purge) DO_PURGE=1 ;;
    --no-indexnow) DO_INDEXNOW=0 ;;
    --allow-behind-main) ALLOW_BEHIND_MAIN=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

cd "$REPO_ROOT"

# Shipping from a branch that is behind main republishes whatever the owner
# fixed there. That is how the Kahar team line came back after being removed.
echo "==> checking this branch has everything from main"
if git fetch -q origin main 2>/dev/null; then
  BEHIND="$(git rev-list --count HEAD..origin/main)"
  if [ "$BEHIND" != "0" ]; then
    echo "This branch is missing $BEHIND commit(s) from origin/main:" >&2
    git log --oneline HEAD..origin/main >&2
    echo "Merge them first (git merge origin/main), or pass --allow-behind-main." >&2
    [ "$ALLOW_BEHIND_MAIN" = "1" ] || exit 1
  fi
else
  echo "    could not reach origin; skipping the main check" >&2
fi

if [ ! -d "$PUBLISHED_WORKTREE/.git" ] && [ ! -f "$PUBLISHED_WORKTREE/.git" ]; then
  cat >&2 <<EOF
No \`published\` worktree at $PUBLISHED_WORKTREE. Create one:

  git fetch origin published
  git worktree add $PUBLISHED_WORKTREE origin/published
EOF
  exit 1
fi

# A stray `jekyll serve` rewrites _site/ underneath us, so always build to BUILD_DIR.
echo "==> building to $BUILD_DIR"
BUILD_LOG="$(mktemp)"
if ! JEKYLL_ENV=production bundle exec jekyll build --destination "$BUILD_DIR" >"$BUILD_LOG" 2>&1; then
  echo "build failed:" >&2
  cat "$BUILD_LOG" >&2
  rm -f "$BUILD_LOG"
  exit 1
fi
rm -f "$BUILD_LOG"

echo "==> checking no retracted wording is in the build"
python3 - "$BUILD_DIR" "$REPO_ROOT/.cursor/forbidden-phrases.txt" <<'PY'
import pathlib
import re
import sys

build, patterns_file = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
if not patterns_file.exists():
    print("    no forbidden-phrases list; skipping")
    raise SystemExit(0)

patterns = [
    line.strip()
    for line in patterns_file.read_text().splitlines()
    if line.strip() and not line.lstrip().startswith("#")
]
if not patterns:
    print("    forbidden-phrases list is empty; skipping")
    raise SystemExit(0)

hits = []
for page in build.rglob("*.html"):
    text = page.read_text(errors="replace")
    for pattern in patterns:
        if re.search(pattern, text):
            hits.append((page.relative_to(build), pattern))

if hits:
    for page, pattern in hits:
        print(f"    RETRACTED TEXT in {page}: /{pattern}/", file=sys.stderr)
    raise SystemExit(
        "Refusing to ship. This wording was removed on purpose (see "
        ".cursor/forbidden-phrases.txt). Fix the source file — and check whether this "
        "branch is simply behind main."
    )
print(f"    clean against {len(patterns)} retracted pattern(s)")
PY

echo "==> checking the homepage lists the newest hub item"
python3 - "$BUILD_DIR" <<'PY'
import json
import pathlib
import re
import sys

build = pathlib.Path(sys.argv[1])
catalog = json.loads((build / "webmcp-catalog.json").read_text())
hub = catalog.get("news", []) + catalog.get("articles", [])
if not hub:
    sys.exit("webmcp catalog has no news or articles")
newest = max(hub, key=lambda item: item.get("datetime") or item["date"])

home = (build / "index.html").read_text()
links = re.findall(r'href="(/(?:news|articles)/[^"]+)"', home)
if not links:
    sys.exit("homepage has no hub teasers")
if links[0] != newest["url"]:
    sys.exit(
        "homepage teasers are stale: first is "
        f"{links[0]}, newest published is {newest['url']} ({newest['date']}). "
        "The teaser list comes from _includes/home-latest.html — do not hand-edit it."
    )
print(f"    homepage leads with {links[0]}")
print(f"    teasers shown: {len(links[:5])}")
PY

echo "==> overlaying onto $PUBLISHED_WORKTREE"
# Never --delete: this build is the whole tree, but the live branch may carry
# files (CNAME, .nojekyll) that a partial checkout would drop.
for dir in news articles logbook assets; do
  [ -d "$BUILD_DIR/$dir" ] || continue
  mkdir -p "$PUBLISHED_WORKTREE/$dir"
  cp -a "$BUILD_DIR/$dir/." "$PUBLISHED_WORKTREE/$dir/"
done
for file in index.html sitemap.xml llms.txt robots.txt webmcp-catalog.json feed.xml 404.html \
            c8e4f0a1b2d39567e8f1a0c4b7d6e529.txt; do
  [ -f "$BUILD_DIR/$file" ] || continue
  cp -a "$BUILD_DIR/$file" "$PUBLISHED_WORKTREE/$file"
done

cd "$PUBLISHED_WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "==> live export already matches the build; nothing to ship"
  exit 0
fi

echo "==> staged changes"
git diff --cached --stat | tail -20

git commit -q -m "Refresh the live export: news, articles, homepage teasers, sitemap, catalogs."
echo "==> committed $(git rev-parse --short HEAD)"
SHIPPED_COMMIT="$(git rev-parse HEAD)"

if [ "$DO_PUSH" = "1" ]; then
  echo "==> pushing to origin/published"
  git push origin HEAD:published
else
  echo "==> not pushed (pass --push)"
fi

if [ "$DO_PUSH" = "1" ] && [ "$DO_INDEXNOW" = "1" ]; then
  echo "==> submitting changed URLs to IndexNow"
  # Only the pages this commit touched. Resubmitting the whole sitemap on every
  # ship is what gets a key throttled.
  SHIPPED_COMMIT="$SHIPPED_COMMIT" INDEXNOW_KEY="$INDEXNOW_KEY" python3 - <<'PY'
import json
import os
import subprocess
import urllib.error
import urllib.request

commit = os.environ["SHIPPED_COMMIT"]
changed = subprocess.run(
    ["git", "diff", "--name-only", f"{commit}^", commit],
    capture_output=True,
    text=True,
    check=False,
).stdout.split()

urls = []
for path in changed:
    if path.endswith("index.html"):
        directory = path[: -len("index.html")]
        urls.append("https://logbook.rocks/" + directory)
    elif path in ("sitemap.xml", "llms.txt", "feed.xml", "webmcp-catalog.json"):
        urls.append("https://logbook.rocks/" + path)

urls = sorted(set(urls))[:10000]
if not urls:
    print("    nothing indexable changed; skipping")
    raise SystemExit(0)

payload = {
    "host": "logbook.rocks",
    "key": os.environ["INDEXNOW_KEY"],
    "keyLocation": f"https://logbook.rocks/{os.environ['INDEXNOW_KEY']}.txt",
    "urlList": urls,
}
req = urllib.request.Request(
    "https://api.indexnow.org/IndexNow",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json; charset=utf-8"},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=40) as resp:
        print(f"    submitted {len(urls)} URL(s), HTTP {resp.status}")
except urllib.error.HTTPError as exc:
    # A rejected submission must not fail a ship that already went live.
    print(f"    IndexNow returned HTTP {exc.code}: {exc.read().decode(errors='replace')[:200]}")
except Exception as exc:  # noqa: BLE001
    print(f"    IndexNow submission failed: {exc}")
PY
fi

if [ "$DO_PURGE" = "1" ]; then
  if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
    echo "==> skipping purge: CLOUDFLARE_API_TOKEN is not set" >&2
  else
    echo "==> purging Cloudflare"
    CF_ZONE_ID="$CF_ZONE_ID" python3 - <<'PY'
import json
import os
import urllib.request

req = urllib.request.Request(
    f"https://api.cloudflare.com/client/v4/zones/{os.environ['CF_ZONE_ID']}/purge_cache",
    data=json.dumps({"purge_everything": True}).encode(),
    headers={
        "Authorization": f"Bearer {os.environ['CLOUDFLARE_API_TOKEN']}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req, timeout=40) as resp:
    body = json.loads(resp.read().decode())
print("    purge success:", body.get("success"), body.get("errors") or "")
PY
  fi
fi

echo "==> done"
