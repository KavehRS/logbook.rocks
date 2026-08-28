---
# DRAFT TEMPLATE — not published
# چهارچوب خبر کوهنوردی
# هنگام ساخت خبر جدید: این سکشن‌ها را نگه دار، متن را از نو بنویس.
layout: null
title: "قالب خبر — درفت"
published: false
sitemap: false
noindex: true
lang: fa-IR
dir_attr: rtl
---

<!--
USAGE (agent-only — do not copy this comment block into published pages)
0) News items live in `_news/` — this is the اخبار stream, distinct from گزارش صعود
1) Copy structure into `_news/YYYY-MM-DD-<slug>.md` (zero-pad month and day)
2) Front matter required:
   layout: post
   title, lang: fa-IR, dir_attr: rtl
   description (unique, ~120–160 chars, not keyword-stuffed)
   date: YYYY-MM-DD (Gregorian for machines; UI shows Jalali)
   tags: [YAML array]
3) Optional related: [{ title, url }] only to other news items when they exist
   image: always a local file under assets/news/<slug>/ — download the source photo first
4) Images: always self-hosted in `assets/news/YYYY-MM-DD-<slug>/` (one folder per news item, named
   like the post file stem). Download every source photo, commit it, and reference
   `/assets/news/<slug>/<file>` from `image:` and each in-body figure. Never point a published page
   at the source host. Publish the standardized copy (max 1600px, sane quality); when the source is
   unusually high quality, keep the untouched original in `assets/news/<slug>/_originals/` too —
   Jekyll skips `_`-prefixed folders, so it stays in git and out of the live site
5) Related public UI: «اخبار مرتبط :» + flat list
6) Hub `/news/` is two columns, both newest first (wire by date; AAJ by `aaj_id`). Homepage `/` is about + four latest teasers; the climbing-news archive is `/news/` (title: خبر کوهنوردی).
7) Do not open with «این خبر را می‌آورم» / curator asides. Body = only the source, in Persian
   (complete translation of every narrative paragraph and fact — not a two-sentence stub, not
   «چکار کردی یا نکردی»). Optional link to an existing `/logbook/` report — do not clone a
   climb report into news. Do not add a مترجم or نویسنده byline.
8) Do not invent events, dates, or team names the user did not give
9) Never paste this template prose unchanged into a published post
-->

{{یک پاراگراف: این خبر چیست و چرا الان نوشته شده}}

{{ترجمهٔ کامل منبع — هر بند روایی و هر واقعیت صعود/مسابقه/ایمنی}}

<!-- optional: لینک به گزارش صعود موجود -->
