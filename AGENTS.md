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

https://logbook.rocks must show the Jekyll 4 Persian blog (`خانه` about + teasers, `/logbook/`, `/news/` as اخبار جهان), not GitHub’s empty Jekyll 3 placeholder titled `logbook.rocks`.

GitHub Actions on the owner account is **billing-locked**, so `.github/workflows/deploy-pages.yml` never deploys. Pages is stuck on the CNAME-only snapshot (`60ffc1e`). Do **not** point DNS at `workers.dev` / jsDelivr / `pages.dev` (Cloudflare error 1014 or TLS 421). Free-plan origin Host override is not available, so Cloudflare cannot fetch GitHub raw server-side.

Until Actions can run, production is:

1. DNS (proxied): apex + `www` CNAME → `kavehrs.github.io`
2. Cloudflare URL rewrite (`http_request_transform`): every path except `/cdn-cgi/` rewrites to origin `/` so GitHub returns 200 HTML (the tiny placeholder)
3. Cloudflare Zaraz tool **Logbook Jekyll bootstrap** (`component: html`, `actionType: event`, trigger `Pageview`) fetches **HTML file URLs** from `https://cdn.jsdelivr.net/gh/KavehRS/logbook.rocks@published` (`/` → `/index.html`) and `document.write`s them. Keep in-site `<a href="/…">` on this domain; rewrite asset URLs onto the same jsDelivr prefix. **Do not fetch HTML from `raw.githubusercontent.com`** — browsers in Iran often cannot reach GitHub, so the tab stays blank for a long time. **Do not fetch jsDelivr directory URLs** (they are CDN listings, not `index.html`). Canonical copy of the tool HTML: `scripts/zaraz-logbook-bootstrap.html`.
4. Orphan branch `published` is the built `_site` (includes `.nojekyll`)
5. Edge extras: Early Hints on; response `Link` preload for `assets/css/main.css` on jsDelivr

After a content change that should go live **before** GitHub billing is fixed:

```bash
bundle exec jekyll build
# replace orphan branch `published` with `_site/`, push, then purge jsDelivr HTML *and* CSS/images:
#   curl "https://purge.jsdelivr.net/gh/KavehRS/logbook.rocks@published/index.html"
#   curl "https://purge.jsdelivr.net/gh/KavehRS/logbook.rocks@published/logbook/index.html"
#   curl "https://purge.jsdelivr.net/gh/KavehRS/logbook.rocks@published/news/index.html"
#   curl "https://purge.jsdelivr.net/gh/KavehRS/logbook.rocks@published/assets/css/main.css"
```

Do not remove the Zaraz HTML tool or the catch-all rewrite while Pages is still the placeholder. When `deploy-pages.yml` succeeds on `main`, GitHub Pages will serve `_site` directly — then delete the Zaraz bootstrap, the rewrite, the CSS preload Link, and Early Hints if unused.

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
| `_news/` | Short climbing news (اخبار) |
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
5. Images for news: `assets/news/<exact-url-slug>/`; comment `image:` out until files exist.
6. Related UI stays `اخبار مرتبط :` + flat list. Hub `/news/` chronological.
7. Homepage `/` lists the 4 newest reports and news items automatically; do not hardcode teasers in `index.md`.
8. For a Cursor Automation, paste `.cursor/automations/news-post-prompt.md` at https://cursor.com/automations/new
9. Open a PR on `cursor/<descriptive-name>-4b4e`, verify `bundle exec jekyll build`.

Related scheduled agents (mandatory after billing recharge; paused until then):

- Weather refresh (4× daily Tehran, active reports only): `.cursor/automations/logbook-weather-update-prompt.md` + `.github/workflows/logbook-weather-agent.yml`
- Daily SEO: `.cursor/automations/daily-seo-prompt.md` + `.github/workflows/daily-seo-agent.yml`
- SEO + AI-source watch (every 45 minutes; technical crawl signals only, never rewrite published posts): `.cursor/automations/seo-ai-source-watch-prompt.md` + `.github/workflows/seo-ai-source-watch.yml`


## Daily SEO agent


When running the scheduled SEO automation (or when asked to audit SEO):

1. Follow `.cursor/skills/daily-seo-audit/SKILL.md` end-to-end.
2. Obey `.cursor/rules/seo-daily-agent.mdc` and `.cursor/rules/logbook-reports.mdc`.
3. Prefer high-confidence technical SEO and discoverability fixes over speculative copy rewrites.
4. Audit every published `/logbook/` and `/news/` URL (unique title/description, canonical, structured data) — logbook first.
5. Never republish duplicate report prose for the same peak.
6. Open a PR on `cursor/<descriptive-name>-4b4e`, verify `bundle exec jekyll build`, then merge to `main` when changes are safe and verified.

## Target ranking theme

Become the authoritative Persian source (on **logbook.rocks**) for:

- گزارش برنامه صعود کوهنوردی
- گزارش صعود سنگ‌نوردی
- گزارش صعود یخ‌نوردی / DryTooling
- گزارش‌های قلل البرز و برنامه‌های آموزشی کوهستان
- اخبار کوتاه کوهنوردی مرتبط با همان برنامه‌ها

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
