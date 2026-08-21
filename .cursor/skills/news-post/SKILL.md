---
name: news-post
description: Agent skill for Persian اخبار — short climbing news on logbook.rocks, distinct from گزارش صعود
---

# News post skill

This is the **news agent** skill. Use when the user asks for `اخبار` / a news item / climbing news on logbook.rocks.

Automation prompt (Cursor dashboard): `.cursor/automations/news-post-prompt.md`  
Agent rule: `.cursor/rules/news-posts.mdc`

## Always read first

1. `AGENTS.md`
2. `.cursor/rules/news-posts.mdc`
3. `_drafts/news-post-template.md`

## Deliverables for a new news item

1. `_news/YYYY-MM-DD-<slug>.md` with `lang: fa-IR`, unique `description`, YAML `tags`
2. Short climber voice (من). Do **not** invent events, dates, or people.
3. Optional link to an existing `/logbook/` report — never clone a full ascent report into news
4. Images in `assets/news/<exact-url-slug>/` only when real files exist
5. Hub `/news/` chronological; related UI = only `اخبار مرتبط :` + flat list
6. Homepage `/` is the about page; do not list news items there. Archive is `/news/`
7. Never publish agent notes in live HTML
8. Reader-facing UI dates Jalali (`_includes/jalali-date.html`)
9. International 6-hour wire: `.cursor/skills/news-wire/SKILL.md`

## Uniqueness

News is a short announcement stream. Do not republish logbook prose. Do not keyword-stuff.
