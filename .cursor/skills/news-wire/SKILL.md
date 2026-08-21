---
name: news-wire
description: Every 6 hours, fetch new climbing/mountaineering news from World Climbing, UIAA, PlanetMountain, and Climbing.com; translate to Persian; triple-review; publish to _news/
---

# International news wire (اخبار)

Use when the scheduled 6-hour news-wire run fires, or when the user asks to refresh اخبار from the four reference sites.

## Sources (only these)

1. https://www.worldclimbing.com (IFSC/World Climbing news linked from that site)
2. https://www.theuiaa.org
3. https://www.planetmountain.com
4. https://www.climbing.com

Prefer RSS when it exists (`https://www.theuiaa.org/feed/`, `https://www.climbing.com/news/feed/`). World Climbing often links through to `ifsc-climbing.org`. If PlanetMountain is bot-blocked, use a search snippet only for facts that are visible on the article page; **omit** anything you cannot confirm.

## Always read first

1. `AGENTS.md`
2. `.cursor/rules/news-posts.mdc`
3. `.cursor/skills/news-post/SKILL.md`
4. `_drafts/news-post-template.md`
5. `_data/news-wire-seen.yml` — skip `items` and `skipped` URLs already listed

## What to publish

- Short Persian **summary**, not a verbatim translation of the English/Italian article.
- One new item per source per run when that source has something unseen. Extra UIAA **equipment recalls** may ship in the same run (safety).
- Link the original article in the body. Do not hotlink or copy their photos.
- Front matter: `layout: post`, `lang: fa-IR`, `dir_attr: rtl`, unique `description`, Gregorian `date`, YAML `tags`, `source` and `source_url`.
- File: `_news/YYYY-MM-DD-<slug>.md` using the article’s publication date (not “today”) when the source gives one.
- Comment `image:` out. No guessed dates, names, grades, or scores.

## Skip

- Stories whose primary subject is child sexual abuse or exploitation
- Items you cannot confirm from the source page
- Duplicates of a story already published from another of the four sites (keep the earlier / closer-to-primary source)
- Marketing listicles with no new climb/federation/safety fact
- When skipping, append the URL under `skipped:` in `_data/news-wire-seen.yml` so later runs do not re-open it

## Triple critical review (required, before commit)

For **each** draft, run three passes and record them in `_seo/news-wire-log.md` (unpublished):

1. **Facts** — names, dates, places, grades, scores match the source; disagreements omitted or quoted as the source’s claim
2. **Language** — natural Persian; route names may stay Latin; no machine-translation calques; no agent notes in the live HTML
3. **Policy** — climber voice (من as curator, not as witness); original summary not a paste; unique description; no photos we do not have; `source_url` appended to `_data/news-wire-seen.yml`

If any pass fails, fix or drop the item. Do not publish a failing draft.

## Ship

1. Branch `cursor/news-wire-<YYYYMMDD-HHMM>-4b4e` on scheduled runs (this repo’s `cursor/*-4b4e` pattern)
2. `bundle exec jekyll build` — `_news/` pages in `_site/news/`; `_seo/` and `.cursor/` unpublished
3. Open PR. Until GitHub Actions billing is unlocked, also refresh the `published` static export so https://logbook.rocks/news/ updates (Zaraz reads HTML from GitHub `published`, not jsDelivr directory URLs)
4. If no unseen items: no PR; one-line summary
