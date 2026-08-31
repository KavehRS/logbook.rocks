---
name: daily-seo-audit
description: Daily SEO audit for logbook.rocks — rank #1 for four pillars and #1–2 for every ascent report
---

# Daily SEO audit skill

Run this every **24 hours** (Cursor Automation or GitHub Action → Cloud Agent API), **and** as job 4 of every GMT news-wire slot (00/06/12/18) via `.cursor/skills/news-wire/SKILL.md`.

When invoked from a news-wire slot: stay on that slot’s branch; do not open a second SEO-only PR; still write `_seo/daily-log.md` and refresh `_seo/ranking-snapshot.md`. The news-wire ship step publishes the SEO HTML.

Dashboard prompt: `.cursor/automations/daily-seo-prompt.md`  
Fallback: `.github/workflows/daily-seo-agent.yml`  
Targets: `_seo/ranking-targets.yml`

## Mission

Make **https://logbook.rocks** the Persian search result that a climber sees first.

| Query | Target URL | Rank goal |
|---|---|---|
| راهنمای صعود | `/logbook/` | **#1** |
| گزارش صعود | `/logbook/` | **#1** |
| کوهنوردی فنی | `/logbook/` | **#1** |
| کوهنوردی در ایران | `/logbook/` | **#1** |

**Every** published `_logbook/*.md` URL must be **#1 or #2** for that climb’s queries (from `peak.name` + templates in `_seo/ranking-targets.yml`), e.g. `گزارش صعود قله کهار`, `کهار راهنمای صعود`.

Related queries (hub + matching reports): گزارش برنامه صعود، مسیر صعود، صعود زمستانه، سنگ‌نوردی، یخ‌نوردی، کوهپیمایی، قلل البرز، کوهنوردی مرتفع، تیغه، ژاندارم — plus `_data/logbook_disciplines.yml`.

Hub `/logbook/` stays chronological. Related blocks stay a flat `گزارش‌های مرتبط :` list. Reader-facing dates stay Jalali (`_includes/jalali-date.html`).

A report on this site **is** a راهنمای صعود when it is a first-hand executed program (route, weather, gear, timing) — not a generic tourism article. Do not invent climbs to chase keywords.

Ranking “#1” is not a switch. Compound people-first reports + technical hygiene + owner Search Console. Do not keyword-stuff. Do not scrape Google SERPs.

## Step 0 — Fresh guidance

Fetch and skim the latest public docs (prefer primary sources):

- Google Search Central (SEO starter, meta tags, robots, sitemaps, structured data / rich results, [AI features](https://developers.google.com/search/docs/appearance/ai-features), people-first content)
- Bing Webmaster Guidelines + IndexNow
- schema.org types relevant to articles, places, mountains, sports/activities
- AI citation surfaces: [llms.txt](https://llmstxt.org/), OpenAI `OAI-SearchBot`, Anthropic `Claude-SearchBot` (training bots may stay disallowed)
- Any material change vs previous run → note it in the PR body

Do not invent “SEO tips” from random blogs when they conflict with primary docs.
Do not rewrite published `_news/` or `_logbook/` bodies during SEO work unless the owner asked to edit that file.

## Step 1 — Live crawl snapshot

Inspect:

1. `https://logbook.rocks/`
2. `https://logbook.rocks/logbook/`
3. `https://logbook.rocks/news/`
4. `https://logbook.rocks/articles/`
5. `https://logbook.rocks/robots.txt`
6. `https://logbook.rocks/sitemap.xml`
7. Every indexed HTML URL in the sitemap (or build output if live fetch fails)

Record: title, meta description, canonical, `lang`/`dir`, H1 count, OG/Twitter tags, JSON-LD validity, obvious broken images/links.

**Index uniqueness (hard):** each sitemap URL must return **its own** HTML (own `<title>`, self-canonical). If several paths return the homepage, that is a rank-zero blocker — fix origin/CDN/rewrite before any copy work.

## Step 2 — Pillar + per-report ranking review

Read `_seo/ranking-targets.yml`. Update `_seo/ranking-snapshot.md`.

### 2a. Four site pillars

For each pillar query, confirm `/logbook/` (or the named `primary_url`) can honestly win:

- Unique title + description that a searcher for that query would click
- Single H1; intro states what the archive is (first-hand reports / guides from executed Iran programs, including technical mountaineering when true)
- CollectionPage JSON-LD `about` includes the four pillars
- Internal links from `/` and `/llms.txt` to `/logbook/`
- Live URL is crawlable (200, not noindex, not a homepage duplicate)

### 2b. Every logbook report (rank 1 or 2)

For each `_logbook/*.md`:

1. Build the query list from `peak.name` (or the distinctive name in the title) using `per_report_query_templates` and extra templates for that report’s `categories`.
2. Score **readiness** (not a scraped SERP position):

   - [ ] Live URL returns this report’s HTML + self-canonical
   - [ ] Unique `title` and `description` (≈120–160 chars when practical); peak name visible in the title
   - [ ] Single H1; `lang` / `dir_attr` correct
   - [ ] `peak.name` present; elevation/lat/lon only if sourced
   - [ ] JSON-LD Article + Mountain when `page.peak` exists
   - [ ] `image` is a real climb asset when available (not the logo)
   - [ ] Categories from `_data/logbook_disciplines.yml` (تیغه/ژاندارم → `technical-mountaineering`)
   - [ ] Internal link to `/logbook/`; related list present when other reports share a discipline
   - [ ] No duplicate body vs another report of the same peak

3. If Search Console (or another owner-provided rank source) is available, record actual position for the primary query `گزارش صعود {peak}`. Otherwise write `position: unknown (no GSC)` and the readiness gaps.
4. Fix **metadata, schema, alts, internal links, hub copy** that block those queries. Do **not** rewrite the narrative to stuff «راهنمای صعود» into every paragraph.

### 2c. How to measure position

- **Preferred:** Google Search Console performance for `logbook.rocks` (owner must add the property). If a token/export is in the environment, use it.
- **Allowed weak check:** indexing only (`site:logbook.rocks` plus the report title) — this is not rank.
- **Forbidden:** scraping google.com / bing.com result pages, buying links, or fabricating SERP screenshots.

## Step 3 — Repo audit checklist

For each `_logbook/*.md`, `_news/*.md`, `_articles/*.md`, and key pages (`index.md`, `logbook.md`, `news.md`, `articles.md`):

- [ ] Unique `title` and `description`
- [ ] `lang` / `dir_attr` correct
- [ ] `image` points to a real climb asset when available (not only the logo)
- [ ] Categories use `_data/logbook_disciplines.yml` slugs plus place/peak tags
- [ ] Upcoming reports still follow weather schedule + challenge-on-significant-change rules when weather text is edited
- [ ] Peak front matter present when known → feeds JSON-LD
- [ ] Headings: single H1, logical H2+
- [ ] Images: meaningful `alt` in Markdown

Technical site-wide:

- [ ] `jekyll-seo-tag` + `jekyll-sitemap` still enabled
- [ ] `robots.txt` points at sitemap
- [ ] Noindex pages stay out of ranking intent (archive, projects, 404, legacy redirects)
- [ ] Favicons / social image resolve (HTTP 200)
- [ ] Structured data includes climb Place/Mountain when `page.peak` exists
- [ ] Performance proxies: oversized images in new posts, missing compression

## Step 4 — Decide what to change today

Priority order:

1. Crawl/index blockers (duplicate homepage HTML, 404 assets, bad canonical, accidental noindex on logbook)
2. Pillar pages (`/logbook/`, site description, CollectionPage `about`, `/llms.txt`) for the four queries
3. Per-report metadata/schema/internal links so each climb can rank 1–2 for its name
4. Hub clarity for related queries without grouping `/logbook/` by category
5. Incremental titles/descriptions without rewriting unique narratives
6. Only then: broader template/CSS SEO hygiene

Skip low-value churn (renaming CSS classes, speculative keyword density edits).

If nothing material is wrong, **make no PR** — still refresh `_seo/ranking-snapshot.md` and a short `_seo/daily-log.md` line when those unpublished files are already in the working tree.

## Step 5 — Implement

- Branch: `cursor/seo-daily-YYYYMMDD-4b4e` (or similar kebab + `-4b4e`)
- Keep uniqueness rules from `.cursor/rules/logbook-reports.mdc`
- Prefer includes/layouts/`_config.yml` for systemic fixes over one-off hacks
- Update `_seo/daily-log.md` and `_seo/ranking-snapshot.md`

## Step 6 — Verify & ship

```bash
bundle exec jekyll build
test ! -e _site/drafts
test ! -e _site/cursor
```

Then: commit → push → open PR → merge after clean build (high-confidence technical SEO).  
If a change is editorial/controversial, leave as draft PR and summarize for the owner instead of merging.

## Success metrics (in `_seo/ranking-snapshot.md`)

- Four pillars: `/logbook/` is the intended #1 URL and is indexable
- Each logbook URL: complete meta + JSON-LD + unique live HTML; GSC position 1–2 when data exists
- No duplicate thin pages; sitemap only indexable URLs
- Each new improvement compounds; avoid oscillating rewrites day-to-day
