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
   image: local file in assets/news/<slug>/ when it exists; otherwise the source article’s own photo URL
4) Images: `assets/news/YYYY-MM-DD-<slug>/` when files exist; otherwise `image:` + in-body figures from the source photo URLs
5) Related public UI: «اخبار مرتبط :» + flat list
6) Hub `/news/` lists wire news newest first; AAJ 2026 is a separate oldest-first `aaj_id` list. Homepage `/` is about + four latest teasers; the climbing-news archive is `/news/` (title: خبر کوهنوردی).
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
