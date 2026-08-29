---
name: news-wire
description: GMT 00/06/12/18 news-wire agent — fetch new climbing news from World Climbing, UIAA, PlanetMountain, Climbing.com, Desnivel, UKClimbing news, and Alpinist Newswire; Persian summary; triple-review; publish to _news/
---

# International news wire agent (خبر کوهنوردی)

Use when the GMT news-wire timer fires, or when the user asks to refresh خبر کوهنوردی from the listed reference sites.

This **is** the automatic agent. Do the work yourself; do not wait for another prompt.

## Schedule (GMT / UTC only)

| Slot | Cron |
|------|------|
| 00:00 GMT (ساعت ۲۴) | `0 0 * * *` |
| 06:00 GMT | `0 6 * * *` |
| 12:00 GMT | `0 12 * * *` |
| 18:00 GMT | `0 18 * * *` |

Combined: `0 0,6,12,18 * * *` (GitHub Actions and Cursor timer, UTC).

- **First series** (manual kickoff only): items published in the **last 1 hour**.
- **Every later series** (scheduled GMT slots and manual tests after that kickoff): translate **all** unseen items published **since `last_run_utc`** in `_data/news-wire-state.yml`. If a slot was missed, catch up the full gap — do not cap at one hour and do not cap at six hours.
- Still skip URLs already listed in `_data/news-wire-seen.yml`.
- Window timestamps live in `_data/news-wire-state.yml`. Update `last_run_utc` after every run, even if nothing published.

## Sources (only these)

1. https://www.worldclimbing.com (IFSC/World Climbing news linked from that site)
2. https://www.theuiaa.org
3. https://www.planetmountain.com
4. https://www.climbing.com
5. https://www.desnivel.com — climbs, alpinism, competitions, expeditions. Prefer category RSS: `/category/alpinismo/feed/`, `/category/escalada-roca/feed/`, `/category/competiciones/feed/`, `/category/expediciones/feed/`, `/category/escalada-hielo/feed/`, `/category/bulder/feed/`. Skip bookshop, cultura-only ads, and generic gear shopping.
6. https://www.ukclimbing.com/news/ — **news desk only**. Do not fetch forums, jobs, classifieds, photo galleries, or gear listings. UKC has no public news RSS. If Cloudflare blocks HTML, use a search snippet only for facts visible on the article page; **omit** the rest.
7. https://alpinist.com/newswire/ — Newswire climb/alpinism news. Site RSS `https://alpinist.com/feed/` is magazine-wide and often gear or features; do **not** treat Mountain Standards reviews, Escape Route lists, shop, or staff HR as wire news. A Newswire or feature with a new climb, federation, or safety fact may be published.

Prefer RSS when it exists (`https://www.theuiaa.org/feed/`, `https://www.climbing.com/news/feed/`, the Desnivel category feeds above, `https://alpinist.com/feed/` filtered as above). World Climbing often links through to `ifsc-climbing.org`. If PlanetMountain or UKClimbing is bot-blocked, use a search snippet only for facts that are visible on the article page; **omit** anything you cannot confirm.

## Always read first

1. `AGENTS.md`
2. `.cursor/rules/news-posts.mdc`
3. `.cursor/skills/news-post/SKILL.md`
4. `_drafts/news-post-template.md`
5. `_data/news-wire-seen.yml` — skip `items` and `skipped` URLs already listed
6. `_data/news-wire-state.yml` — previous run time

## What to publish

- Short Persian **summary**, not a verbatim translation of the English, Italian, or Spanish article.
- Do **not** open with curator asides such as «خبر را اینجا می‌آورم»، «خلاصه می‌کنم»، or «خودم آنجا نبودم». Start with the news.
- News pages have no مترجم or نویسنده byline. Do not add either in the post body.
- Publish **every** unseen item in the window that passes triple review (not one-per-source). Extra UIAA **equipment recalls** may ship in the same run (safety).
- Link the original article in the body. Do not hotlink or copy their photos.
- Front matter: `layout: post`, `lang: fa-IR`, `dir_attr: rtl`, unique `description`, Gregorian `date`, YAML `tags`, `source` and `source_url`.
- File: `_news/YYYY-MM-DD-<slug>.md` using the article’s publication date (not “today”) when the source gives one.
- Comment `image:` out. No guessed dates, names, grades, or scores.

## Skip

- Stories whose primary subject is child sexual abuse or exploitation
- Items you cannot confirm from the source page
- Duplicates of a story already published from another of the listed sources (keep the earlier / closer-to-primary source)
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
4. If no unseen items in the window: no PR; log the empty window in `_seo/news-wire-log.md`; still update `_data/news-wire-state.yml`
5. Never invent results for a live event that has no source article yet
