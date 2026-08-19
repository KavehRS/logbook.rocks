# DNS / Cloudflare checklist — logbook.rocks

Not published on the site.

## Zone

`logbook.rocks` nameservers (2026-08-19): `ken.ns.cloudflare.com` / `melina.ns.cloudflare.com` — same Cloudflare account pattern as `kavehrs.com`.

Intended public hosts:

| Host | Record | Target |
|---|---|---|
| `logbook.rocks` (apex) | CNAME flattening (proxied) or GitHub Pages A/AAAA | GitHub Pages / Cloudflare Pages |
| `www.logbook.rocks` | CNAME (proxied) → apex or Pages | 301 to `https://logbook.rocks/` |

Do **not** add a wildcard `*`. Re-check if a spam host appears.

## Owner / agent actions

1. Cloudflare Pages project `logbook-rocks`: build `bundle exec jekyll build`, output `_site` (`wrangler.toml`).
2. GitHub Pages: workflow `.github/workflows/deploy-pages.yml`, custom domain `logbook.rocks`.
3. TLS: Full (strict) if origin is GitHub Pages HTTPS; otherwise Full. HSTS via `_headers`.
4. Register `https://logbook.rocks` in [Google Search Console](https://search.google.com/search-console) (URL-prefix **and** domain property) and Bing Webmaster Tools.
5. Submit sitemap: `https://logbook.rocks/sitemap.xml`
6. After launch: 301 `/logbook/*` on `www.kavehrs.com` to the same path on `logbook.rocks` (owner, in `KavehRS/website`) so Google does not treat two copies of the same reports as duplicates.

## Historical note (kavehrs.com zone)

The old personal site still lives at `www.kavehrs.com`. Spam-subdomain cleanup for that zone is documented in the `KavehRS/website` `_seo/` files, not here. Do not recreate `pop` / `tri` / `*` on either zone.
