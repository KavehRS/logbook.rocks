# Daily SEO agent log

Append-only run notes for the scheduled SEO agent. Not published on the site.

## 2026-08-19 — migrate logbook to logbook.rocks

- Transferred `_logbook/` (22 reports), assets, rules, skills, automations, and SEO targeting from `KavehRS/website` to `KavehRS/logbook.rocks`.
- Public site: `https://logbook.rocks` with hubs `/logbook/` and `/news/`.
- Ranking target is now this domain. Owner still needed: Cloudflare DNS/Pages, GSC + Bing for `logbook.rocks`, 301 from `kavehrs.com/logbook/` after launch.

## 2026-08-04 — bootstrap

- Added daily SEO skill, Cursor Automation prompt, optional GitHub Actions trigger.
- Baseline: logbook CollectionPage + Mountain Article JSON-LD when `page.peak` is set.
- Auto related links for logbook by shared discipline categories (public UI: flat «گزارش‌های مرتبط :» list).
- Tuned site/logbook descriptions toward گزارش برنامه صعود کوهنوردی / سنگ‌نوردی / یخ‌نوردی.
- Sources consulted at bootstrap: Google Search Central (SEO basics, sitemaps, structured data), schema.org `Article` / `Mountain` / `CollectionPage`, Bing Webmaster Guidelines overview.

## 2026-08-04 — related UI + taxonomy sync

- Related public UI: only «گزارش‌های مرتبط :» + flat list (no «بر اساس نوع برنامه…», no discipline headings).
- Hub `/logbook/` chronological by date.
- Added/confirmed `technical-mountaineering` (کوهنوردی فنی) for ridge/gendarme/alpine hand-and-foot; rock/wall reserved for true rock/wall.
- Kahar pre-report corrected to one-day on ۱۶ مرداد ۱۴۰۵.
- Synced AGENTS.md, logbook rules/skills/template/sample.

## 2026-08-04 — Jalali UI dates

- Footer «آخرین بروزرسانی», post meta, and `/logbook/` list dates use Jalali via `_includes/jalali-date.html` (e.g. 13 مرداد 1405).

## 2026-08-05 — Ascent-report agent

- Added on-demand logbook ascent-report agent: `.cursor/automations/logbook-ascent-report-prompt.md`, `.cursor/rules/logbook-ascent-agent.mdc`, AGENTS.md + skill entry points.

## 2026-08-12 — Full SEO remediation

- **Categories:** normalized all 22 logbook posts to `_data/logbook_disciplines.yml` slugs (`mountaineering` / `ice-climbing` / `training` / `traverse` removed).
- **peak front matter:** added or fixed on all 22 reports (renamed legacy `site:` → `peak:` on ice/rock training posts).
- **Duplicate titles:** Hezarla 1402 vs 1403 titles differentiated.
- **OG image:** Kahar 1405 report uses climb cover in slug folder (placeholder from 1402 until 1405 photos uploaded).
- **DNS (owner action):** `pop.kavehrs.com` spam subdomain — see `_seo/subdomain-dns-checklist.md`.
- Live check: sitemap 35 URLs, robots OK, 0 broken asset refs.

- Weather: use only accurate peak/region sources; omit distant proxies (e.g. Kahar drops Mountain-Forecast).
- Report lifecycle: `report_status: active` until post-climb completion; agent stays active entire time.
- Automation configured but paused until Cursor account recharge; mandatory always-on after.

## 2026-08-12 — Authority roadmap

- Added unpublished `_seo/authority-roadmap.md`: path to become the leading Persian ascent-report source.
- Based on live inventory (22 reports), competitor club SERPs, and Google Search Central people-first / E-E-A-T guidance.
- Does not change published pages.

## 2026-08-12 — No guessed facts

- Owner rule: published data must be sourced or omitted; only that climb’s experience may be un-sourced narrative/GPS/times.
- Added `.cursor/rules/logbook-facts.mdc`; synced AGENTS.md, logbook rules/skill/template/automation.
- Removed rounded placeholder coordinates (Pol-Khab, Kamachal, Dona, Naz geo conflict); stripped `[reference:N]` leftovers.
- Kahar machine elevation/coords aligned to SummitPost/Wikipedia (4015 m) with Persian 4050 noted as disagreement.

## 2026-08-15 — Kahar 1405 published without photos

- Owner: ship this report without waiting for climb photos.
- Removed `image:` and deleted the 1402 team-photo placeholder (`cover.jpeg` was a copy of `6039_orig.jpeg`).
- Asset folder kept with `.gitkeep`. OG/JSON-LD image omitted (not the other climb’s photo, not the site logo as Article image).

## 2026-08-15 — Kahar photos paused + discoverability

- Commented Kahar ۱۴۰۵ `image:` until owner uploads climb photos to `assets/mount/logbook/2026-08-07-kahar-peak/`.
- Homepage: short logbook block + 3 first-hand reports (internal links; people-first, not keyword stuffing).
- Visible byline + crumbs on logbook/news posts (Google E-E-A-T “Who”).
- BreadcrumbList + hub ItemList; Article image omitted when it would be the site logo.
- Twitter card `summary_large_image`; blog index shows Jalali dates + descriptions.
- Daily SEO skill/automation now audits every sitemap logbook **and** blog URL.
- Sources: Google SEO starter, people-first content, Article + Breadcrumb structured data, sitemap guidance. Bing webmaster page required JS (no extra guideline text).
- Owner still needed: Search Console + Bing sitemap submit, DNS spam (`pop.kavehrs.com`), Cursor recharge so daily SEO/weather automations run.

## 2026-08-18 — Latest blog note SEO + WebMCP remainder

- Target URL: `/blog/2026-08-18-mountaineering-return-knowledge/`
- Live already had unique title/description, canonical, `lang=fa-IR`/`dir=rtl`, single H1, `og:image`/`twitter:image` = `Cover.jpg`, `BlogPosting` from jekyll-seo-tag, sitemap entry, cover `<img class="post-cover">`.
- Fixes implemented:
  - Cover `alt` + `image` hash (`path`/`width`/`height`/`alt`) for OG dimensions and `og:image:alt`
  - `width`/`height` + `fetchpriority="high"` on the cover (CLS/LCP)
  - BreadcrumbList last item now includes `item` URL (Google Breadcrumb docs)
  - In-body links to existing ice-climbing logbook reports (no related-block heading mismatch)
  - Hub `/news/` description + CollectionPage `about` include mountaineering notes
  - Author JSON-LD name aligned with visible byline (`کاوه‌ رضائی‌شیراز`); `timezone: Asia/Tehran` for ISO dates
  - IndexNow key file (Bing/Yandex); ping after Pages deploy
- WebMCP addable remainder: declarative filter forms on `/logbook/` and `/news/` (`toolname`/`tooldescription`); catalog tags/categories; `search_site` / `get_ascent_report` / `get_note`
- Beyond-repo: Cloudflare zone `kavehrs.com` (NS ken/melina) is live; `pop`/`docs`/`*` absent. Set `Permissions-Policy: tools=(self)` and `Origin-Agent-Cluster: ?1` on `www` (verified in live response headers). Minimum TLS 1.2. Origin trial token still needs owner Chrome OT signup.

## 2026-08-18 — Cloudflare live-zone audit

Checked via API on active zone `kavehrs.com` (Free, NS ken/melina). Applied:

- SSL `full` → `strict` (GitHub Pages origin still HTTP 200)
- TLS min 1.2 (already), TLS 1.3 on
- HSTS `max-age=15552000` without includeSubDomains/preload; `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`
- Early Hints on
- Apex `always_use_https` + page rule 301 `kavehrs.com/*` → `www`

Left unchanged on purpose: `blog.kavehrs.com` Blogger CNAME; Rocket Loader off; hotlink protection off; no wildcard.

Owner asked for strictest DMARC: `p=reject; sp=reject; adkim=s; aspf=s; pct=100; fo=1` (reports still to Cloudflare `rua`). SPF tightened from `~all` to `-all`.

Domain bar raised the same day: DNSSEC on at Cloudflare (CDS published; parent DS still pending at Registrar.eu — no registrar API here), HSTS 1-year + includeSubDomains + preload, CAA limited to Google Trust Services + Let's Encrypt. Apex HTTP→HTTPS same-host hop fixed; `kavehrs.com` submitted to hstspreload.org (`status: pending`).

Owner follow-up left: Cloudflare Email Routing MX is present but routing is unconfigured — confirm `@kavehrs.com` mail. If you send from Proton as `@kavehrs.com`, those messages will now fail until Proton is added to SPF/DKIM. Chrome WebMCP origin trial still needs an OT token.

## 2026-08-19 — SEO + AI-source watch (45 min), no published-copy edits

- Owner correction: every 45 minutes monitor **SEO materials** and **being listed as an AI source**, then apply on the site **without damaging or changing published posts**. Not a Google-rank poll. Not a harvest of club climb reports.
- Added `/llms.txt` (llmstxt.org v2 index from existing titles/descriptions), `rel=describedby` + catalog alternate in the default layout, origin `robots.txt` Content-Signal `search=yes, ai-input=yes, ai-train=no, use=reference`, explicit Allow for OAI-SearchBot / Claude-SearchBot / PerplexityBot / Googlebot / Bingbot.
- Cloudflare managed training Disallows (GPTBot, Google-Extended, ClaudeBot) left as-is.
- Scheduler: `.cursor/skills/seo-ai-source-watch/SKILL.md`, `.cursor/automations/seo-ai-source-watch-prompt.md`, `.github/workflows/seo-ai-source-watch.yml` (spawn agent only when `_seo/guidance-sources.yml` fingerprint changes).
- `_news/` and `_logbook/` files were not edited in this run.
- Loop stays paused until Cursor billing + Automation / `CURSOR_API_KEY`.

## 2026-08-27 00:00 GMT — news-wire slot SEO (job 4)

- Sources consulted: Google Search Central SEO starter (`developers.google.com/search/docs/fundamentals/seo-starter-guide`); no material change vs last published-branch snapshot for this site’s tags/canonical/JSON-LD pattern.
- Live origin `https://logbook.rocks/*` is still the GitHub Pages placeholder (~1.7 KB) — expected while Actions billing is locked. Audit used `https://raw.githubusercontent.com/KavehRS/logbook.rocks/published/` HTML.
- Published snapshot: home/news/logbook each have unique title + meta description, `lang=fa-IR` `dir=rtl`, canonical on this domain, single H1 on home and news. Logbook hub still has **two H1s** (pre-existing collection heading + page title) — not churned this slot.
- `robots.txt` still points at sitemap + llms.txt; sitemap 41 URLs (17 news / 23 logbook) before this slot’s two AAJ notes.
- This slot adds two unique news URLs (Chuchepo, Jiongmudazhi) with remote AAJ covers; `_pages/llms.txt` and `_pages/webmcp-catalog.json` are collection-driven so the build lists them. No logbook/news body rewrite for keywords.
- No template/CSS SEO edit. Ship with the news-wire PR + `published` overlay.

## 2026-08-27 06:00 GMT — news-wire slot SEO (job 4)

- Sources consulted: same Google Search Central starter pattern as the 00:00 slot; no material change to crawl signals.
- Live origin still the GitHub Pages placeholder; audit uses `published` raw HTML.
- This slot adds two unique news URLs (Manamcho, Chomolhari III) with remote AAJ covers, unique titles/descriptions, `lang=fa-IR`/`dir=rtl`. `llms.txt` / sitemap / webmcp catalog are collection-driven.
- Logbook hub still has two H1s (pre-existing) — not churned. No logbook/news body rewrite for keywords. No template/CSS SEO edit.

## 2026-08-28 06:00 GMT — news-wire slot SEO (job 4)

- Sources consulted: Google Search Central SEO starter; no material change to crawl signals vs last slot.
- Live origin still the GitHub Pages placeholder; audit uses `published` raw HTML plus this slot’s production build.
- This slot adds three unique news URLs (Desnivel Oury/Lenin; AAJ Bel Uluu; AAJ Arches Peak) with unique titles/descriptions, `lang=fa-IR`/`dir=rtl`, remote source photos. `/news/` already splits wire (newest first) from AAJ (`aaj_id` oldest first). Collection-driven `llms.txt` / sitemap / webmcp catalog pick up the new posts on build.
- Logbook hub still has two H1s (pre-existing) — not churned. No logbook/news body rewrite for keywords. No template/CSS SEO edit.

## 2026-08-28 off-slot UIAA letter SEO

- Owner-requested UIAA NMA letter (`/news/2026-08-28-uiaa-nma-august2026/`). Unique title/description, `lang=fa-IR`/`dir=rtl`, remote source cover, collection-driven sitemap/`llms.txt`.
- Not a GMT slot SEO rewrite. No template/CSS change. `last_run_utc` left at `2026-08-28T07:40:00Z`.

## 2026-08-28 whole-site SEO sweep (owner request: maximum SEO, no content change)

Audited the full production build after the AAJ dump: 283 HTML pages, 269 indexable.

Already clean, left alone:

- Titles and meta descriptions unique on every indexable page (0 duplicates across 269).
- Canonical on every page; `lang=fa-IR` / `dir=rtl` everywhere; exactly one H1 per page (the old logbook-hub double H1 is gone).
- JSON-LD parses on every page. `BreadcrumbList` + `Article`/`NewsArticle` on posts, `CollectionPage` + `ItemList` on all three hubs.
- Zero broken internal links or missing/empty `alt` across 1,646 images.
- Sitemap 269 URLs (227 articles / 23 logbook / 18 news / home); the 13 `/news/…-aaj-…` redirect stubs are `noindex` and excluded.
- `robots.txt` Content-Signal + explicit allow for OAI-SearchBot / Claude-SearchBot / PerplexityBot / Googlebot / Bingbot.

Changed (technical only — no published prose touched):

1. **Image dimensions on every local `<img>`** — 1,644 of 1,646 tags had no `width`/`height`, so every photo caused layout shift. `_plugins/image_dimensions.rb` reads real dimensions from the file at build time (pure-Ruby JPEG/PNG/GIF/WebP header parse, cached) and stamps them into the rendered HTML. News and article bodies carry hand-written `<img>` tags, so this is the only way to fix all of them without editing 250+ published files. Added `height: auto` to the base `img` rule so the attributes stay a pure aspect-ratio hint.
2. **`ImageObject` in JSON-LD** — page covers were bare URLs. They now carry width/height from the same measurement, which is what image rich results need. Also corrected jekyll-seo-tag's `"@type": "imageObject"` casing (schema.org type names are case-sensitive).
3. **Atom feeds** — the site had none. `/feed.xml` (all sections, newest 50), `/logbook/feed.xml`, `/news/feed.xml`, `/articles/feed.xml`. Linked via `rel=alternate` in `<head>` (section feed added on section pages), listed in `llms.txt` and `robots.txt`. Summaries only, never full bodies.
4. **IndexNow submission on ship** — `script/ship-live.sh --push` now posts the URLs that commit changed to `api.indexnow.org` (skip with `--no-indexnow`). It submits only changed URLs, never the whole sitemap. A rejected submission logs and does not fail a ship that already went live.
5. **Ship script root files** — it never copied the IndexNow key file or the new feed, so the key could go stale and the feed would not reach `published`. Both are in the copy list now.
6. **`preconnect` to `cdn.jsdelivr.net`** — live pages are assembled by Zaraz and every asset, including the LCP image, comes from jsDelivr, so the connection was opening cold.
7. **`_headers`** — immutable one-year cache for `/assets/*` and correct `application/atom+xml` content type for the feeds.

**Biggest find — the non-HTML files were never actually served.** On the live domain `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/webmcp-catalog.json` and the IndexNow key all answered `200 text/html` with GitHub's 2 KB placeholder page. The zone-wide rewrite sends every path to the origin root and Zaraz only rebuilds *pages*, so robots.txt was unparseable, the sitemap was undiscoverable, and IndexNow rejected submissions with `SiteVerificationNotCompleted`.

Fixed with `script/cloudflare/deploy-seo-files.py`:

- Nine Cloudflare redirect rules (302) send those paths to the same file on the `published` branch. Redirect rules evaluate against the original path, so they fire ahead of the rewrite — verified with a throwaway probe path before deploying. Target is raw.githubusercontent.com, not jsDelivr: jsDelivr labels XML correctly but caches a branch alias for hours, and a stale sitemap is worse than one labelled `text/plain`.
- Cloudflare's **managed robots.txt** was answering `/robots.txt` at the edge ahead of any rule, and its file has **no `Sitemap:` directive** — that is how search engines find a sitemap without anyone submitting it. Turned it off and moved its training-crawler block list (Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, CloudflareBrowserRenderingCrawler, Google-Extended, GPTBot, meta-externalagent) into the repo's `robots.txt`, which also keeps `ai-input=yes` and the explicit allows for OAI-SearchBot / Claude-SearchBot / PerplexityBot. Trade-off: the block list no longer updates itself, so a new training crawler has to be added by hand. `--revert` hands it back to Cloudflare.
- Edge compute would have been cleaner (a Snippet returning each file with its own content type) but the zone is Free plan and this repo's API token has neither Snippets nor Workers permission.

Verified live: all nine files 200 `text/plain`, robots.txt is the repo's own with the Sitemap line, `/sitemap.xml` parses as XML with 269 URLs, and IndexNow now returns 202. Submitted all 269 URLs once — none had ever been submitted.

Noted, deliberately not changed:

- 217 article `<title>`s run past ~70 characters. They are the visible Persian headlines naming climbers, peak, and route; trimming them would be a content edit and Google rewrites overlong titles anyway.
- No `srcset`/WebP derivatives. Live photos are already capped near 1080–1600px and generating variants would multiply the asset tree.
- Pages themselves are still JS-dependent: `https://logbook.rocks/<anything>` returns the placeholder and Zaraz swaps in the real HTML. Googlebot renders JS, most other crawlers do not. Only unlocking GitHub Actions billing fixes that; nothing in this repo can.

Sources: Google Search Central (SEO starter, sitemaps, structured data / image rich results, Core Web Vitals / CLS), Bing Webmaster Guidelines + IndexNow, schema.org `Article` / `ImageObject` / `CollectionPage`, RFC 4287 (Atom), llmstxt.org.

## 2026-08-31 — why nothing ranks for «قله کهار»

Owner asked why the site is not on page 1 for «قله کهار». It is not a ranking problem: **the pages are not indexable at all.**

Every URL on the live domain returns the *homepage* HTML with `<link rel="canonical" href="https://logbook.rocks/">`:

```
https://logbook.rocks/logbook/2026-08-07-kahar-peak/   200  8869b  title=کاوه‌ رضائی‌شیراز | گزارش صعود   canonical=/
https://logbook.rocks/articles/                        200  8869b  (identical)
https://logbook.rocks/this-path-does-not-exist/        200  8869b  (identical)
```

A self-referencing canonical pointing elsewhere is the strongest possible "this page is a duplicate" signal, so Google drops all ~269 URLs into the homepage and indexes none of them. `site:logbook.rocks` returns nothing, and a search naming the domain surfaces only third-party pages that mention Kaveh's reports.

Cause: the Cloudflare catch-all rewrite (`http_request_transform`, every path except `/cdn-cgi/` → `/`) from the placeholder era. **GitHub Pages now serves the real site**, `status: built` from `main`, legacy build — so the Actions billing lock is no longer what is blocking anything. Asked directly past Cloudflare (`--resolve logbook.rocks:80:185.199.110.153`), the origin returns per-path HTML with correct titles, self-canonicals, 404 on unknown paths, and working `sitemap.xml`, `robots.txt`, feeds, catalog, CSS, JS and photos. The Kahar report at origin: `<title>گزارش صعود قله کهار از کلوان — ۱۶ مرداد ۱۴۰۵</title>`, H1 the same, 31 occurrences of «کهار», unique description.

Fix prepared in `script/cloudflare/serve-origin-html.py` (removes the rewrite and the now-redundant SEO-file redirects, after probing that the origin serves the page). It could not be run in this session: this cloud agent only has `CLOUDFLARE_ACCOUNT_ID`, not `CLOUDFLARE_API_TOKEN`. The Zaraz bootstrap tool must be disabled by hand at the same time.

Also found: host canonicalisation is correct (`www` → apex, http → https, `/path` → `/path/`). The legacy Pages build ignores `_plugins/`, so live HTML lacks the image `width`/`height` and keeps the `imageObject` casing bug that `published` has fixed — one reason to point Pages at `published`.

Second-order, for after indexing works: page 1 for «قله کهار» is held by guide pages (espilat.com, naturemount.ir, mojekooh.com, berimkouh.com, decovel.com) answering "where is it, how hard, which route, how long". The logbook page is a single-day trip report — a different intent, and realistically a long-tail target («گزارش صعود قله کهار از کلوان», «قله کهار مرداد ۱۴۰۵») before the head term. No content change was made for this.



