---
layout: default
title: مقالات
description: >-
  ترجمهٔ کامل گزارش‌ها و مقالات کوهنوردی از منابع معتبر، جدا از خبر و اطلاعیه.
permalink: /articles/
lang: fa-IR
dir_attr: rtl
---

<h1>مقالات</h1>
<p>گزارش برنامه‌ها و مقاله‌های ترجمه‌شده اینجاست؛ خبر و اطلاعیه در <a href="{{ '/news/' | relative_url }}">خبر کوهنوردی</a> می‌ماند.</p>
<p class="news-hub-note">American Alpine Journal ۲۰۲۶، تاریخ انتشار نشریه ۱۰ مهر ۱۴۰۵ (۱ اکتبر ۲۰۲۶)، از جدید به قدیم.</p>
{% assign article_posts = site.articles | sort: "aaj_id" | reverse %}
{% if article_posts.size == 0 %}
<p>هنوز مقاله‌ای در این بخش منتشر نشده است.</p>
{% else %}
{% include hub-filter.html toolname="filter_articles" tooldescription="Filter the published journal translations listed on this page by title or summary text." %}
<ul data-hub-list data-hub-page-size="10" data-hub-page-key="a">
  {% for post in article_posts %}
  {% include news-hub-item.html post=post %}
  {% endfor %}
</ul>
{% endif %}
