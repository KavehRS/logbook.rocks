# Agent instructions — logbook.rocks

Jekyll mountaineering site (Cloudflare Pages + GitHub Pages): https://logbook.rocks  
Repo: `KavehRS/logbook.rocks` · default branch: `main`

Ascent reports, logbook rules, SEO targeting, and agent skills were transferred here from `kavehrs.com` (`KavehRS/website`). The personal/engineering site remains https://www.kavehrs.com.

## Cloudflare MCP (same account as kavehrs.com)

This repo registers the official Cloudflare MCP servers in `.cursor/mcp.json` (same set as `KavehRS/website`). Use them to manage the `logbook.rocks` zone: DNS, Pages, SSL, redirects.

| Server | URL | Auth |
|--------|-----|------|
| `cloudflare` | https://mcp.cloudflare.com/mcp | OAuth (same Cloudflare account as kavehrs.com) |
| `cloudflare-docs` | https://docs.mcp.cloudflare.com/mcp | Public |
| `cloudflare-bindings` | https://bindings.mcp.cloudflare.com/mcp | OAuth |
| `cloudflare-builds` | https://builds.mcp.cloudflare.com/mcp | OAuth |
| `cloudflare-observability` | https://observability.mcp.cloudflare.com/mcp | OAuth |

On first Cloudflare tool use, complete OAuth. After that, agents on this repo can configure `logbook.rocks` without a stored API token.

Platform skills live in `.cursor/skills/cloudflare/` and `.cursor/skills/wrangler/`.

Do not commit API tokens. Prefer MCP over pasting `CLOUDFLARE_API_TOKEN` into chat.

## Live site (GitHub Actions billing lock)

https://logbook.rocks must show the Jekyll 4 Persian blog (`خانه` about + teasers, `/logbook/`, `/news/` as خبر کوهنوردی, `/articles/` as مقالات), not GitHub’s empty Jekyll 3 placeholder titled `logbook.rocks`.

GitHub Actions on the owner account is **billing-locked**, so `.github/workflows/deploy-pages.yml` never deploys. Pages is stuck on the CNAME-only snapshot (`60ffc1e`). Do **not** point DNS at `workers.dev` / jsDelivr / `pages.dev` (Cloudflare error 1014 or TLS 421).

Until Actions can run, production is:

1. DNS (proxied): apex + `www` CNAME → `kavehrs.github.io`
2. Cloudflare URL rewrite (`http_request_transform`): every path except `/cdn-cgi/` rewrites to origin `/` so GitHub returns 200 HTML
3. Cloudflare Zaraz tool **Logbook Jekyll bootstrap** (`component: html`, `actionType: event`, trigger `Pageview`) fetches **HTML** from `https://raw.githubusercontent.com/KavehRS/logbook.rocks/published` + path (`/` → `/index.html`) and `document.write`s it. Keep in-site `<a href="/…">` on this domain; only rewrite asset URLs (`src`, CSS, favicons) onto `https://cdn.jsdelivr.net/gh/KavehRS/logbook.rocks@published`. **Never pin a jsDelivr commit SHA in Zaraz** — that freezes the live site on an old export. jsDelivr’s `@published` branch alias can lag; do not fetch HTML from jsDelivr directory URLs (they are CDN listings, not `index.html`).
4. Orphan branch `published` is the built `_site` (includes `.nojekyll`)
5. Cloudflare redirect rules (`http_request_dynamic_redirect`) send the non-HTML SEO files to the same file on `published`. Zaraz rebuilds *pages* only, so without these `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/webmcp-catalog.json`, the Atom feeds and the IndexNow key all answer `200 text/html` with GitHub's placeholder. Manage them with `script/cloudflare/deploy-seo-files.py` (`--check` to list, `--revert` to remove). Adding a new machine-readable file at the site root means adding it to `PATHS` there too, or it will not be reachable.
6. Cloudflare's **managed robots.txt** is deliberately **off**. It used to answer `/robots.txt` at the edge ahead of any rule, and it carries no `Sitemap:` directive. The repo's `robots.txt` is now the live one and holds the training-crawler block list itself — a new training crawler has to be added there by hand.

After a content change that should go live **before** GitHub billing is fixed:

```bash
script/ship-live.sh --push --purge
```

That script is the only supported way to update the live export. It builds to a temp destination (a leftover `jekyll serve` rewrites `_site/` underneath you), overlays the `published` worktree **without** `--delete`, and refuses to finish when:

- the branch is behind `origin/main` (see “Merge main before shipping” below),
- the build contains wording listed in `.cursor/forbidden-phrases.txt`, or
- the homepage teasers do not lead with the newest hub item.

Copying files by hand is how `/`, `/news/`, the sitemap, and the machine catalogs drift behind the article that was just published. Purge jsDelivr separately only when CSS or images look stale (`https://purge.jsdelivr.net/gh/KavehRS/logbook.rocks@published/<path>`).

### Merge main before shipping (required)

The owner edits published pages directly on `main`. A `cursor/*` branch forked before those edits still carries the old text, so building from it **silently restores wording the owner removed** — that is exactly how the Kahar team line came back on 28 Aug 2026, three days after `main@c29bb8f` fixed it. Run `git merge origin/main` before every ship; `script/ship-live.sh` aborts if you forget.

### Retracted wording never returns

When the owner asks for text to be taken out for good, delete it **and** add a matching regex to `.cursor/forbidden-phrases.txt`. Every ship greps the built HTML against that list and aborts on a hit, so no later branch, revert, or template change can put it back. The list is excluded from the build.

**Every publish refreshes the homepage.** `/` lists the four newest logbook reports plus the **five newest hub items, with اخبار and مقالات merged and sorted by date** — `_includes/home-latest.html` derives both lists from the collections, so never hardcode teasers in `index.md` and never hand-edit the built HTML.

Do not remove the Zaraz HTML tool or the catch-all rewrite while Pages is still the placeholder. When `deploy-pages.yml` succeeds on `main`, GitHub Pages will serve `_site` directly — then delete the Zaraz bootstrap and the rewrite.

## Install / verify

```bash
bundle install
bundle exec jekyll build
```

Build must succeed before opening or merging a PR. Drafts under `_drafts/` and `.cursor/` must never appear in `_site/`.

## Collections

| Path | Purpose |
|------|---------|
| `_logbook/` | Published climb / ascent reports (primary SEO target) |
| `_news/` | Climbing news (خبر کوهنوردی) |
| `_drafts/` | Unpublished templates/samples only |

## Factual accuracy (required)

Published pages must not contain **guessed or unsourced** numbers or species lists. Omit the field if there is no named source.

The **only** exception is the experience of **that** climb (clock times, rests, GPS of that day, weather as felt, who was on the team). Do not copy “typical” hours, rounded lat/lon, or tourism-blog flora into a report.

If elevations/coordinates disagree across named sources, publish the disagreement — do not hide it behind «حدود». Details: `.cursor/rules/logbook-facts.mdc`.

## Climb-report weather (required)

Every `_logbook` ascent report weather section uses **only accurate sources** for that peak and region:

1. **Open-Meteo** — peak coordinates + elevation (+ trailhead when useful); usually always
2. **[Mountain-Forecast](https://www.mountain-forecast.com/)** — **only** when the peak has its own forecast page (no distant proxy)
3. **[Meteoblue](https://www.meteoblue.com/)** — peak coordinates + summit elevation when reliable

**Omit** any source without accurate peak/region data. Number only sources actually used. Gear and challenges derive from those sources only.

Refresh schedule (Asia/Tehran): **04:00, 10:00, 16:00, 22:00** for `report_status: active` reports from creation until **22:00 the night before** program start. See `.cursor/rules/logbook-weather-schedule.mdc`.

If a forecast change is **noticeable**, add/update `## چالش‌های برنامه` with before→after details (sources, time, impact) — see thresholds in `.cursor/rules/logbook-reports.mdc`.

## Report lifecycle

- Agent stays **active** from report creation until `report_status: completed` or user confirms the post-climb report is finished.
- New reports: `report_status: active`. When done: `report_status: completed`.

## Automation billing (owner)

Scheduled agents (weather 4×/day, SEO daily, SEO+AI-source every 45 minutes) are **configured but paused** until the site owner recharges their Cursor account and enables:

- Cursor Automation(s) from `.cursor/automations/`, **and/or**
- GitHub secret `CURSOR_API_KEY` for `.github/workflows/logbook-weather-agent.yml` and `.github/workflows/seo-ai-source-watch.yml`

Until then: all rules still apply when the user or a manual agent run triggers work.

**After recharge: enable schedulers — mandatory always-on; do not wait for user prompts for weather refresh.**


## Climb-report images (required)

Folder `assets/mount/logbook/<slug>/` must match the report URL slug exactly (`/logbook/<slug>/`). See `.cursor/rules/logbook-assets.mdc`.


## Logbook categories, hub, related links

- `categories` must use discipline slugs in `_data/logbook_disciplines.yml` only (training-camp, snowfield, glacier, icefall, winter-ascent, high-altitude, technical-mountaineering / کوهنوردی فنی, hiking, rock-climbing, wall-climbing).
- Classification: ridge / gendarme / alpine hand-and-foot → `technical-mountaineering`. Use `rock-climbing` / `wall-climbing` only for true rock or multipitch wall routes.
- Hub `/logbook/` lists reports **chronologically by date** (newest first), not by category.
- Related reports are **selected** by shared categories, but the **public UI** is only `گزارش‌های مرتبط :` + a flat list — no «بر اساس نوع برنامه…» note and no category subheadings on the page.
- Never put agent/implementation instructions into published page copy; keep them in `.cursor/` and `_drafts/` comments.
- Published logbook prose is the climber’s voice (من / ما / تیم). No «ترک منتشر نشده», JSON-LD, source-footnote asides, or notes about how the agent wrote the page.
- Program dates/length come from the user only (e.g. Kahar is one-day on ۱۶ مرداد ۱۴۰۵ unless the user changes it).
- Reader-facing dates use Jalali via `_includes/jalali-date.html` (footer «آخرین بروزرسانی», post meta, hub list) — e.g. `13 مرداد 1405`, not `04 August 2026`. Keep ISO/`date:` Gregorian for machines. Report body program dates should be Jalali-first.


## Logbook ascent-report agent

When asked to create or update a `گزارش صعود` / climb report:

1. Follow `.cursor/skills/logbook-ascent-report/SKILL.md` end-to-end.
2. Obey `.cursor/rules/logbook-ascent-agent.mdc` and `.cursor/rules/logbook-reports.mdc` (plus weather/assets rules).
3. Use `_drafts/logbook-ascent-report-template.md`; treat `_drafts/samples/kahar-peak-report-framework-sample.md` as structure only.
4. For a Cursor Automation, paste `.cursor/automations/logbook-ascent-report-prompt.md` at https://cursor.com/automations/new
5. Open a PR on `cursor/<descriptive-name>-4b4e`, verify `bundle exec jekyll build`, then merge to `main` when safe.

## News agent

When asked for `اخبار` / a climbing news item / update to `_news/`:

1. Follow `.cursor/skills/news-post/SKILL.md`.
2. Obey `.cursor/rules/news-posts.mdc`.
3. Use `_drafts/news-post-template.md` (structure only — never publish placeholders).
4. File: `_news/YYYY-MM-DD-<slug>.md` with zero-padded date, `lang: fa-IR`, YAML `tags` array, unique description.
5. Images for news: **always self-hosted**. Download every photo the source article uses into `assets/news/<exact-url-slug>/` — one folder per news item, named exactly like the post file stem — commit it, and point `image:` plus every in-body `<figure>` at `/assets/news/<slug>/<file>`. Never leave a published page pointing at the source host: readers whose networks block S3, desnivel.com, or theuiaa.org would see empty frames. Standardize the published copy: cap width at 1600px and re-encode files stored at wasteful quality, but keep the original bytes whenever re-encoding would make the file larger. When a source photo really is stored at unusually high quality, **keep the untouched original too**, in `assets/news/<slug>/_originals/<file>`. Jekyll skips any directory whose basename starts with `_`, so the archive stays in git while only the standardized copy reaches `_site` and the live `published` branch — verify with `find _site -path '*_originals*'` returning nothing. Do not write what the agent did or didn’t do in the article body.
6. Related UI stays `اخبار مرتبط :` + flat list. Hub `/news/` is a single wire list, newest first, ten items then a pager. Journal translations live on `/articles/` with `مقالات مرتبط :`.
7. Homepage `/` is the about page («درباره من») plus the four newest گزارش صعود teasers and the **five newest hub teasers with اخبار and مقالات merged by date**. It updates on every publish through `_includes/home-latest.html`; do not hardcode or hand-edit that list. Full reports live on `/logbook/`; climbing news on `/news/`; journal articles on `/articles/`.
8. For a Cursor Automation, paste `.cursor/automations/news-post-prompt.md` at https://cursor.com/automations/new
9. Open a PR on `cursor/<descriptive-name>-4b4e`, verify `bundle exec jekyll build`.

Related scheduled agents (mandatory after billing recharge; paused until then):

- Weather refresh (4× daily Tehran, active reports only): `.cursor/automations/logbook-weather-update-prompt.md` + `.github/workflows/logbook-weather-agent.yml`
- Daily SEO: `.cursor/automations/daily-seo-prompt.md` + `.github/workflows/daily-seo-agent.yml`
- SEO + AI-source watch (every 45 minutes; technical crawl signals only, never rewrite published posts): `.cursor/automations/seo-ai-source-watch-prompt.md` + `.github/workflows/seo-ai-source-watch.yml`
- خبر کوهنوردی agent (GMT 00:00 / 06:00 / 12:00 / 18:00 — each slot: new non-duplicate items from all listed sources as complete translations; only **new** AAJ 2026 listing items into `_articles/`; re-check live `_news/` and `_articles/` translations; whole-site SEO; ship to live `published`): `.cursor/skills/news-wire/SKILL.md` + `.cursor/automations/news-wire-prompt.md` + `.github/workflows/news-wire-agent.yml`


## Daily SEO agent


When running the scheduled SEO automation (or when asked to audit SEO):

1. Follow `.cursor/skills/daily-seo-audit/SKILL.md` end-to-end.
2. Obey `.cursor/rules/seo-daily-agent.mdc` and `.cursor/rules/logbook-reports.mdc`.
3. Prefer high-confidence technical SEO and discoverability fixes over speculative copy rewrites.
4. Audit every published `/logbook/`, `/news/`, and `/articles/` URL (unique title/description, canonical, structured data) — logbook first.
5. Never republish duplicate report prose for the same peak.
6. Open a PR on `cursor/<descriptive-name>-4b4e`, verify `bundle exec jekyll build`, then merge to `main` when changes are safe and verified.

## Target ranking theme

Become the authoritative Persian source (on **logbook.rocks**) for:

- گزارش برنامه صعود کوهنوردی
- گزارش صعود سنگ‌نوردی
- گزارش صعود یخ‌نوردی / DryTooling
- گزارش‌های قلل البرز و برنامه‌های آموزشی کوهستان
- اخبار کوتاه کوهنوردی جهان مرتبط با همان برنامه‌ها

## Do not

- Commit secrets, API keys, or credentials
- Publish `_drafts/`
- Invent climb facts, weather, team members, coordinates, elevations, or flora/fauna
- Invent news events, dates, or photos
- Publish rounded placeholder lat/lon or «حدود» in place of a missing source
- Weaken uniqueness of logbook narratives for SEO

## Cursor Cloud specific instructions

Static Jekyll 4 site (Ruby 3.2). Standard commands live in `## Install / verify` above.

- Gems install into `./vendor/bundle` (gitignored via a local `bundle config path`). The startup update script runs `bundle install`, so gems are ready — no need to reinstall unless `Gemfile`/`Gemfile.lock` changed.
- Run the dev server with `bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload`. It auto-regenerates on file changes; there is no separate lint step for this site — `bundle exec jekyll build` succeeding is the check.
- The Sass `@import` / `lighten()` deprecation warnings during build/serve are expected and harmless; the build still finishes with exit code 0.
- Adding/removing content files is picked up by the running server via auto-regeneration; editing `_config.yml` requires restarting the server.
