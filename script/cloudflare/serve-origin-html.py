#!/usr/bin/env python3
"""Stop rewriting every logbook.rocks path to the origin root.

While GitHub Pages was not deploying, a zone-wide URL rewrite sent every path to
`/` and a Zaraz tool rebuilt the real page in the browser. GitHub Pages now
serves the whole site again — every path returns its own HTML, with its own title
and a self-referencing canonical — but the rewrite is still in place, so every
one of the ~269 URLs answers with the homepage and `canonical: https://logbook.rocks/`.

That is a direct instruction to Google that none of those pages exist, which is
why nothing ranks: a page Google has canonicalised away cannot be indexed, and an
unindexed page cannot appear for any query.

This script removes the rewrite and the SEO-file redirects that only existed to
work around it, after checking the origin really does serve per-path HTML.

Zaraz has to be switched off by hand, in Dash → Zaraz → Tools: disable the
"Logbook Jekyll bootstrap" tool. Left enabled it document.writes the page a
second time on top of the correct HTML.

Usage:
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/serve-origin-html.py --check
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/serve-origin-html.py
  CLOUDFLARE_API_TOKEN=... python3 script/cloudflare/serve-origin-html.py --revert
"""
from __future__ import annotations

import http.client
import json
import os
import re
import sys
import urllib.error
import urllib.request

ZONE = os.environ.get("CF_ZONE_ID", "bb0257be09f261a3c9b40a5d7f55c586")
API = "https://api.cloudflare.com/client/v4"
PAGES_IP = "185.199.110.153"
HOST = "logbook.rocks"

REWRITE_EXPRESSION = (
    'not starts_with(http.request.uri.path, "/cdn-cgi/") and http.request.uri.path ne "/"'
)

# A path whose own title must come back from the origin before we trust it.
PROBE_PATH = "/logbook/2026-08-07-kahar-peak/"
PROBE_TITLE = "قله کهار"


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


def origin_serves_own_pages() -> bool:
    """Ask GitHub Pages directly, bypassing Cloudflare, what it serves for PROBE_PATH."""
    conn = http.client.HTTPConnection(PAGES_IP, 80, timeout=30)
    try:
        conn.request("GET", PROBE_PATH, headers={"Host": HOST, "User-Agent": "logbook-preflight"})
        resp = conn.getresponse()
        body = resp.read().decode("utf-8", "replace")
    finally:
        conn.close()

    title = re.search(r"<title>(.*?)</title>", body, re.S)
    title = title.group(1).strip() if title else ""
    print(f"    origin {PROBE_PATH} -> HTTP {resp.status}, title {title[:60]!r}")
    return resp.status == 200 and PROBE_TITLE in title


def ruleset(phase: str) -> dict:
    for candidate in api(f"/zones/{ZONE}/rulesets")["result"]:
        if candidate["phase"] == phase and candidate["kind"] == "zone":
            return api(f"/zones/{ZONE}/rulesets/{candidate['id']}")["result"]
    sys.exit(f"no zone ruleset for phase {phase}")


def show() -> None:
    transform = ruleset("http_request_transform")
    print("  http_request_transform:")
    for rule in transform.get("rules") or []:
        print(f"    {rule['action']}: {rule['expression']}")
    if not transform.get("rules"):
        print("    (no rules — origin HTML is served as-is)")

    redirects = ruleset("http_request_dynamic_redirect")
    print(f"  http_request_dynamic_redirect: {len(redirects.get('rules') or [])} rule(s)")
    print("  origin preflight:")
    origin_serves_own_pages()


def apply_changes() -> None:
    print("==> checking the origin serves per-path HTML")
    if not origin_serves_own_pages():
        sys.exit(
            "Origin did not return the expected page. Leaving the rewrite in place — without it "
            "every URL would break."
        )

    transform = ruleset("http_request_transform")
    rules = [r for r in (transform.get("rules") or []) if r.get("action") != "rewrite"]
    print(f"==> removing the origin-root rewrite ({len(transform.get('rules') or [])} -> {len(rules)} rule(s))")
    api(f"/zones/{ZONE}/rulesets/{transform['id']}", "PUT", {"rules": rules})

    print("==> removing the SEO-file redirects (the origin serves those files itself now)")
    redirects = ruleset("http_request_dynamic_redirect")
    api(f"/zones/{ZONE}/rulesets/{redirects['id']}", "PUT", {"rules": []})

    print("==> done. Now disable the Zaraz 'Logbook Jekyll bootstrap' tool in the dashboard,")
    print("    then purge the cache: script/ship-live.sh --push --purge")


def revert() -> None:
    transform = ruleset("http_request_transform")
    rules = list(transform.get("rules") or [])
    if any(r.get("action") == "rewrite" for r in rules):
        print("    rewrite already present")
        return
    rules.append(
        {
            "enabled": True,
            "description": "Send every path to the origin root",
            "expression": REWRITE_EXPRESSION,
            "action": "rewrite",
            "action_parameters": {"uri": {"path": {"value": "/"}}},
        }
    )
    api(f"/zones/{ZONE}/rulesets/{transform['id']}", "PUT", {"rules": rules})
    print("==> rewrite restored; re-run deploy-seo-files.py to bring back the file redirects")


def main() -> None:
    args = sys.argv[1:]
    if "--check" in args:
        show()
    elif "--revert" in args:
        revert()
    else:
        apply_changes()


if __name__ == "__main__":
    main()
