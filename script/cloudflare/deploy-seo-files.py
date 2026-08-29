#!/usr/bin/env python3
"""Make logbook.rocks' non-HTML SEO files reachable on the live domain.

Live pages are assembled in the browser: a zone-wide rewrite sends every path to
the origin root and Zaraz then document.writes the real HTML fetched from the
`published` branch. That works for pages and silently breaks everything that is
not a page. /robots.txt, /sitemap.xml, /llms.txt, /webmcp-catalog.json, the Atom
feeds and the IndexNow key all answered `200 text/html` with GitHub's placeholder
page, so the sitemap was undiscoverable, robots.txt was unparseable, and IndexNow
could not verify the host.

The clean fix is edge compute (a Snippet or Worker returning the file with the
right content type), but the zone is on the Free plan and the API token this repo
uses has neither Snippets nor Workers permission. Redirect rules are available
and, unlike the rewrite, they evaluate against the original path.

The redirect target is raw.githubusercontent.com rather than jsDelivr. jsDelivr
labels each file correctly (application/xml for the sitemap and feeds) but caches
a branch alias for hours, and a sitemap that lags a publish is worse than a
sitemap labelled text/plain. Search engines parse a sitemap by its contents, not
its content type; robots.txt, llms.txt and the IndexNow key want text/plain
anyway.

The redirects are 302, not 301: this is a workaround for the GitHub Actions
billing lock, and a cached permanent redirect would outlive it.

/robots.txt needs one extra step. Cloudflare's managed robots.txt answers that
path at the edge ahead of any redirect rule, and its file has no Sitemap
directive — which is how Google and Bing discover the sitemap without anyone
submitting it. So this script also turns the managed file off, and the repo's
robots.txt carries the same training-crawler block list plus the Sitemap line.
Re-enable the managed file with --revert if you would rather Cloudflare keep that
block list up to date for you.

Usage:
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/deploy-seo-files.py
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/deploy-seo-files.py --revert
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/deploy-seo-files.py --check
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

ZONE = os.environ.get("CF_ZONE_ID", "bb0257be09f261a3c9b40a5d7f55c586")
API = "https://api.cloudflare.com/client/v4"
PUBLISHED = "https://raw.githubusercontent.com/KavehRS/logbook.rocks/published"

PATHS = [
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
    "/webmcp-catalog.json",
    "/feed.xml",
    "/logbook/feed.xml",
    "/news/feed.xml",
    "/articles/feed.xml",
    "/c8e4f0a1b2d39567e8f1a0c4b7d6e529.txt",
]


def token() -> str:
    value = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not value:
        sys.exit("CLOUDFLARE_API_TOKEN is not set")
    return value


def api(path: str, method: str = "GET", body: dict | None = None) -> dict:
    req = urllib.request.Request(
        API + path,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {token()}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        sys.exit(f"{method} {path} -> HTTP {exc.code}: {exc.read().decode(errors='replace')[:400]}")


def redirect_ruleset_id() -> str:
    for ruleset in api(f"/zones/{ZONE}/rulesets")["result"]:
        if ruleset["phase"] == "http_request_dynamic_redirect" and ruleset["kind"] == "zone":
            return ruleset["id"]
    sys.exit("no zone http_request_dynamic_redirect ruleset")


def rules() -> list[dict]:
    return [
        {
            "enabled": True,
            "description": f"Serve {path} from the published branch",
            "expression": f'http.request.uri.path eq "{path}"',
            "action": "redirect",
            "action_parameters": {
                "from_value": {
                    "status_code": 302,
                    "target_url": {"value": PUBLISHED + path},
                    "preserve_query_string": False,
                }
            },
        }
        for path in PATHS
    ]


def set_managed_robots(enabled: bool) -> None:
    current = api(f"/zones/{ZONE}/bot_management")["result"]
    if current.get("is_robots_txt_managed") == enabled:
        print(f"    Cloudflare managed robots.txt already {'on' if enabled else 'off'}")
        return
    api(f"/zones/{ZONE}/bot_management", "PUT", {"is_robots_txt_managed": enabled})
    print(f"    Cloudflare managed robots.txt turned {'on' if enabled else 'off'}")


def main() -> None:
    args = sys.argv[1:]
    ruleset_id = redirect_ruleset_id()

    if "--check" in args:
        current = api(f"/zones/{ZONE}/rulesets/{ruleset_id}")["result"].get("rules") or []
        for rule in current:
            target = rule["action_parameters"]["from_value"]["target_url"]["value"]
            print(f"  {rule['expression']:52s} -> {target}")
        managed = api(f"/zones/{ZONE}/bot_management")["result"].get("is_robots_txt_managed")
        print(f"  {len(current)} rule(s) | Cloudflare managed robots.txt: {managed}")
        return

    revert = "--revert" in args
    payload = {"rules": [] if revert else rules()}
    api(f"/zones/{ZONE}/rulesets/{ruleset_id}", "PUT", payload)
    print(f"==> {len(payload['rules'])} redirect rule(s) deployed")
    set_managed_robots(enabled=revert)


if __name__ == "__main__":
    main()
