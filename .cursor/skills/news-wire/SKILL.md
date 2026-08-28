---
name: news-wire
description: GMT 00/06/12/18 cycle — new non-duplicate items from all listed sources (complete translation), next two AAJ 2026 queue notes, re-check published translations, whole-site SEO, then ship live
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

## Each GMT slot (mandatory, in this order)

Owner: this is the six-hour job. Do all five. Do not drop a step because the wire window was empty.

1. **New items from every listed source** — complete Persian translation of every unseen, non-duplicate article since `last_run_utc` (first series: last 1 hour). Never summarize.
2. **AAJ 2026 queue** — after the 2026 volume dump, `_data/aaj-backfill.yml` `remaining` is empty. Job 2 is only **new** publication-year-2026 listing items that appeared after `last_run_utc`. Append them to `remaining`, then publish each as a complete Persian translation in `_articles/` dated the journal street date (`2026-10-01`). Photos go in `assets/articles/<slug>/`. Do not publish 2025. Do not dump ANAC, book reviews, or in memoriam.
3. **Re-check previous translations** — every live `_news/` and `_articles/` post against its `source_url`. Fix wrong names/dates/grades/places, missing paragraphs, and leftover short items that omit source facts. Log the re-check in `_seo/news-wire-log.md`.
4. **Whole-site SEO** — run `.cursor/skills/daily-seo-audit/SKILL.md` for the **entire** site (`/`, `/logbook/`, `/news/`, `/articles/`, sitemap, robots, every indexed URL). Stay on this slot’s news-wire branch (do not open a second SEO-only PR). Log in `_seo/daily-log.md`. SEO must not undo translation fixes and must not invent climb facts.
5. **Publish** — PR, then `script/ship-live.sh --push --purge`. Every publish also refreshes the homepage: `/` shows the four newest logbook reports plus the **five newest hub items with اخبار and مقالات merged by date**, so a new item in either section changes it. The script fails if the homepage does not lead with the newest item. The cycle is not done until the live export has the work.

- **First series** (manual kickoff only): items published in the **last 1 hour**.
- **Every later series** (scheduled GMT slots and manual tests after that kickoff): translate **all** unseen items published **since `last_run_utc`** in `_data/news-wire-state.yml`. If a slot was missed, catch up the full gap for sources 1–9 — do not cap at one hour and do not cap at six hours. For AAJ, after the 2026 dump: only **new** 2026 listing items since `last_run_utc` (append to `remaining`, then publish into `_articles/`). Do not rewind `last_run_utc`. Do not publish 2025.
- Still skip URLs already listed in `_data/news-wire-seen.yml` (except when job 3 is re-checking a URL already published).
- Window timestamps live in `_data/news-wire-state.yml`. Update `last_run_utc` after every run, even if the wire window was empty.

## Sources (only these)

1. https://www.worldclimbing.com (IFSC/World Climbing news linked from that site)
2. https://www.theuiaa.org
3. https://www.planetmountain.com
4. https://www.climbing.com
5. https://www.desnivel.com — climbs, alpinism, competitions, expeditions. Prefer category RSS: `/category/alpinismo/feed/`, `/category/escalada-roca/feed/`, `/category/competiciones/feed/`, `/category/expediciones/feed/`, `/category/escalada-hielo/feed/`, `/category/bulder/feed/`. Skip bookshop, cultura-only ads, and generic gear shopping.
6. https://www.ukclimbing.com/news/ — **news desk only**. Do not fetch forums, jobs, classifieds, photo galleries, or gear listings. UKC has no public news RSS. If Cloudflare blocks HTML, use a search snippet only for facts visible on the article page; **omit** the rest.
7. https://alpinist.com/newswire/ — Newswire climb/alpinism news. Site RSS `https://alpinist.com/feed/` is magazine-wide and often gear or features; do **not** treat Mountain Standards reviews, Escape Route lists, shop, or staff HR as wire news. A Newswire or feature with a new climb, federation, or safety fact may be published.
8. https://explorersweb.com — climbing, expeditions, and 8000er news. Prefer category RSS: `/category/climbing/feed/`, `/category/expeditions/feed/`, `/category/8000ers/feed/`. Skip ocean rowing, cycling, kite-buggy travel, weekly link roundups, generic adventure explainers with no climb, and running ultras that are not alpine link-ups.
9. DAV and CAI **expedition reports** only — German and Italian alpine-club teams, Expedkader, Eagle Team, spedizioni, new routes. DAV: `https://www.alpenverein.de/thema/expeditionskader` and press `https://www.alpenverein.de/verband/presse/pressemeldungen/`. CAI: `https://www.loscarpone.cai.it/` and expedition pages on `https://www.cai.it/`. No public expedition RSS; fetch HTML. Skip membership, courses, insurance, jobs, phone-support notices, and sport-prize roundups with no climb.
10. American Alpine Journal at `https://publications.americanalpineclub.org/` — **Climbs and Expeditions** and climb Feature Articles. Listing `/articles` is newest-first; each page has Climb Year and Publication Year. No RSS. Skip Book Reviews, In Memoriam, Club Activities, editorials, AAC shop, and Accidents in North American Climbing (ANAC/ANAM). **Owner: publication year 2026 only** (not 2025). Translate each note **in full**. The 2026 volume is published on this site under `_articles/` dated the journal street date **1 Oct 2026 / ۱۰ مهر ۱۴۰۵**. After that dump, job 2 is only **new** 2026 listing items (append to `_data/aaj-backfill.yml` `remaining`, then publish). Do not dump 2025. Do not invent death counts.

Prefer RSS when it exists (`https://www.theuiaa.org/feed/`, `https://www.climbing.com/news/feed/`, the Desnivel category feeds above, `https://alpinist.com/feed/` filtered as above, the ExplorersWeb category feeds above). World Climbing often links through to `ifsc-climbing.org`. If PlanetMountain or UKClimbing is bot-blocked, use a search snippet only for facts that are visible on the article page; **omit** anything you cannot confirm. DAV, CAI, and AAJ are HTML.

## Always read first

1. `AGENTS.md`
2. `.cursor/rules/news-posts.mdc`
3. `.cursor/skills/news-post/SKILL.md`
4. `_drafts/news-post-template.md`
5. `_data/news-wire-seen.yml` — skip `items` and `skipped` URLs already listed (job 3 still re-opens published URLs to re-check)
6. `_data/news-wire-state.yml` — previous run time
7. `_data/aaj-backfill.yml` — AAJ 2026 complete-translation queue (live files in `_articles/`; after the dump, `remaining` holds only **new** 2026 listing items)
8. `.cursor/skills/daily-seo-audit/SKILL.md` — whole-site SEO is job 4 of every GMT slot

## What to publish

- **Owner: never invent a two-sentence stub.** Every listed source gets a **complete** Persian translation of that article — every narrative paragraph and climb/competition/safety fact on the source page. Original Persian (not an English dump). Route and peak names may stay Latin. «فقط متن رو خلاصه کنی» means the live body is only that source text — no agent process notes.
- **AAJ 2026** lives in `_articles/` (مقالات), not `_news/`. Date every note with the journal street date `2026-10-01` (time from `aaj_id` so newer ids sort later). Complete translation of each note. After the volume dump, do not reopen the old two-per-slot backfill.
- Do **not** open with curator asides such as «خبر را اینجا می‌آورم»، «خلاصه می‌کنم», or «خودم آنجا نبودم». Start with the news.
- Do not write what the agent did or didn’t do («عکسی کپی نکردم», fetch/CORS notes, «قله را ادعا نکردم»).
- News pages have no مترجم or نویسنده byline. Do not add either in the post body.
- For World Climbing, UIAA, PlanetMountain, Climbing.com, Desnivel, UKClimbing, Alpinist, ExplorersWeb, and DAV/CAI: publish **every** unseen item in the window that passes triple review (not one-per-source), each as a complete translation. Extra UIAA **equipment recalls** may ship in the same run (safety).
- For the AAJ 2026 queue: notes are `_articles/2026-10-01-aaj-<slug>.md` with photos in `assets/articles/<slug>/`. After the dump, job 2 publishes only **new** 2026 listing items. Do not publish publication year 2025.
- Link the original article in the body. Photos: **self-host every one**. Download the source article’s photos (`og:image`, article `<figure>`, article `<img>`) into `assets/news/<slug>/` — one folder per item, named exactly like the post file stem — commit them, and point `image:` and every in-body figure at `/assets/news/<slug>/<file>`. A published page must never load a photo from the source host; readers on networks that block S3, desnivel.com, or theuiaa.org would see empty frames. Cap width at 1600px and re-encode files stored at wasteful quality, but keep the original bytes when re-encoding would grow the file. When a source photo is stored at unusually high quality (AAJ often is), archive the untouched original in `assets/news/<slug>/_originals/<file>` as well — Jekyll skips `_`-prefixed directories, so only the standardized copy is published. Translate captions. Skip ads, logos, placeholders, and related-story thumbs.
- Front matter: `layout: post`, `lang: fa-IR`, `dir_attr: rtl`, unique `description`, Gregorian `date`, YAML `tags`, `source` and `source_url`.
- File: `_news/YYYY-MM-DD-<slug>.md` using the article’s publication date (not “today”) when the source gives one. **AAJ 2026 notes are not news.** They live in `_articles/2026-10-01-aaj-<slug>.md`, dated the journal street date, with photos under `assets/articles/<slug>/`.
- AAJ notes also need `aaj_id:` (the queue id, quoted). Hub `/articles/` sorts by `aaj_id` newest-first. Hub `/news/` is wire-only. Homepage teasers merge اخبار and مقالات by date.
- Set `image:` from a local file or from a source photo URL. No guessed dates, names, grades, or scores.

## AAJ 2026 procedure (each GMT slot, after the volume dump)

1. Fetch the AAJ listing. Any **new** publication-year-2026 Climbs and Expeditions / feature item not already in `published` or `remaining` appends to the **end** of `remaining`.
2. Publish each new remaining note as a complete Persian translation in `_articles/` dated `2026-10-01` (time from `aaj_id`). Download photos into `assets/articles/<slug>/`. No مترجم/نویسنده. No agent process notes in the body.
3. Move published ids from `remaining` into `published`, set `remaining_count`, refresh `next_ids`. Append each `source_url` to `_data/news-wire-seen.yml`.
4. Do not publish publication year 2025. Do not dump ANAC / book reviews / in memoriam.
5. Set `aaj_id` from the queue id. `/articles/` sorts by `aaj_id` newest-first.

## Skip

- Stories whose primary subject is child sexual abuse or exploitation
- Items you cannot confirm from the source page
- Duplicates of a story already published from another of the listed sources (keep the earlier / closer-to-primary source)
- Marketing listicles with no new climb/federation/safety fact
- When skipping, append the URL under `skipped:` in `_data/news-wire-seen.yml` so later runs do not re-open it

## Re-check previous translations (each GMT slot)

After new items and any new AAJ notes are drafted, open every file in `_news/` and `_articles/` that has a `source_url`. Fetch the source. Compare. Fix:

- Wrong or omitted names, dates, places, grades, scores
- Missing narrative paragraphs (a short leftover from the old invented summary rule is an error — complete it)
- Unnatural Persian / English paste
- Agent asides, مترجم/نویسنده bylines, leftover «عکسی کپی نکردم» lines, missing source photo URLs when the source has photos

Do not invent facts to “improve” a translation. If the source page cannot be fetched, say so in the log and leave unverified sentences unchanged. Record pass/fail per slug in `_seo/news-wire-log.md`.

## Triple critical review (required, before commit)

For **each** draft, run three passes and record them in `_seo/news-wire-log.md` (unpublished):

1. **Facts** — names, dates, places, grades, scores match the source; disagreements omitted or quoted as the source’s claim
2. **Language** — natural Persian; route names may stay Latin; no machine-translation calques; no agent notes in the live HTML
3. **Policy** — climber voice (من as curator, not as witness); complete translation of the source text, not a two-sentence stub and not an English paste; unique description; body has no agent process notes; every photo self-hosted under `assets/news/<slug>/` or `assets/articles/<slug>/` with no remaining reference to the source host; unusually high-quality sources archived under `_originals/` and absent from `_site`; `source_url` appended to `_data/news-wire-seen.yml`

If any pass fails, fix or drop the item. Do not publish a failing draft.

## Ship

1. Branch `cursor/news-wire-<YYYYMMDD-HHMM>-4b4e` on scheduled runs (this repo’s `cursor/*-4b4e` pattern)
2. `bundle exec jekyll build` — `_news/` pages in `_site/news/`; `_seo/` and `.cursor/` unpublished
3. Open (or update) the PR whenever jobs 1–4 changed anything. A slot with no new source-1–9 items still PRs if job 2 shipped AAJ notes, job 3 fixed a translation, or job 4 changed SEO.
4. Until GitHub Actions billing is unlocked, ship the live export with **`script/ship-live.sh --push --purge`**. It builds to a temp destination (a stray `jekyll serve` would clobber `_site/`), overlays `published` **without** `--delete`, and aborts if the homepage teasers do not lead with the newest hub item. Do not hand-copy files instead: that is how `/` teasers, `/news/`, the sitemap, and the machine catalogs end up stale while the new article itself looks fine. Zaraz already loads HTML from that `published` branch — **do not pin a jsDelivr SHA**. Confirm `https://raw.githubusercontent.com/KavehRS/logbook.rocks/published/...` has the pages (the branch alias caches for ~5 minutes; a commit-pinned URL shows the truth immediately). The cycle is unfinished if the live export is missing the work.
5. If jobs 1–4 truly changed nothing: no PR; log the empty wire window plus the re-check and SEO pass in `_seo/news-wire-log.md` and `_seo/daily-log.md`; still update `_data/news-wire-state.yml`.
6. Never invent results for a live event that has no source article yet.
