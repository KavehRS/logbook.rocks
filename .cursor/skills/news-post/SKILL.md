---
name: news-post
description: Agent skill for Persian اخبار — complete translation of climbing news on logbook.rocks, distinct from گزارش صعود
---

# News post skill

This is the **news agent** skill. Use when the user asks for `اخبار` / `خبر کوهنوردی` / `اخبار جهان` / a news item / climbing news on logbook.rocks.

Automation prompt (Cursor dashboard): `.cursor/automations/news-post-prompt.md`  
Agent rule: `.cursor/rules/news-posts.mdc`

## Always read first

1. `AGENTS.md`
2. `.cursor/rules/news-posts.mdc`
3. `_drafts/news-post-template.md`

## Deliverables for a new news item

1. `_news/YYYY-MM-DD-<slug>.md` with `lang: fa-IR`, unique `description`, YAML `tags`
2. Body = only the source, in Persian. Complete translation of every narrative paragraph and fact. «فقط متن رو خلاصه کنی» means only the source text — no agent process notes — not a two-sentence stub. Wire items: `.cursor/skills/news-wire/SKILL.md`. Do **not** invent events, dates, or people. Do not open with «این خبر را می‌آورم». Do not add a مترجم or نویسنده byline; news pages have none. Do not write what you did or didn’t do («عکسی کپی نکردم»).
3. Optional link to an existing `/logbook/` report — never clone a full ascent report into news
4. Photos: **always self-hosted**. Download the source article’s photos into `assets/news/<exact-url-slug>/` (one folder per news item, named like the post file stem), commit them, and point `image:` and every in-body figure at `/assets/news/<slug>/<file>`. Never ship a page that loads a photo from the source host. Publish the standardized copy (max 1600px, sane quality); when the source file is unusually high quality, keep the untouched original in `assets/news/<slug>/_originals/` too — Jekyll ignores `_`-prefixed folders, so it never goes live
5. Hub `/news/` (title: خبر کوهنوردی): two columns on desktop, stacked on mobile; both newest first; ten items per column then pager. Related UI = only `خبرهای مرتبط :` + flat list
6. Homepage `/` is about («درباره من») plus four newest logbook teasers and the five newest hub teasers (اخبار + مقالات merged by date) — refreshed on every publish by `_includes/home-latest.html`; world-news archive is `/news/`
7. Never publish agent notes in live HTML
8. Reader-facing UI dates Jalali (`_includes/jalali-date.html`)
9. خبر کوهنوردی agent (GMT 00/06/12/18): `.cursor/skills/news-wire/SKILL.md` — new items, two AAJ notes, re-check translations, whole-site SEO, publish

## Uniqueness

News is the translated wire, not a logbook climb report. Do not republish logbook prose. Do not keyword-stuff.
