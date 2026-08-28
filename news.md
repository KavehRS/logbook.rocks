---
layout: default
title: خبر کوهنوردی
description: >-
  خبرها و اطلاعیه‌هایی که توی منابع معتبر بین‌المللی می‌بینم و می‌خوانم را
  ترجمه می‌کنم و در این بخش منتشر می‌کنم.
permalink: /news/
lang: fa-IR
dir_attr: rtl
---

<h1>خبر کوهنوردی</h1>
<p>خبر و اطلاعیه اینجاست. گزارش برنامه و مقالهٔ ترجمه‌شده را در <a href="{{ '/articles/' | relative_url }}">مقالات</a> می‌خوانید.</p>
{% assign wire_posts = site.news | where_exp: "post", "post.layout != 'redirect'" | sort: "date" | reverse %}
{% if wire_posts.size == 0 %}
<p>هنوز خبری در این بخش منتشر نشده است.</p>
{% else %}
{% include hub-filter.html toolname="filter_news" tooldescription="Filter the published world news items listed on this page by title or summary text." %}
<ul data-hub-list data-hub-page-size="10" data-hub-page-key="w">
  {% for post in wire_posts %}
  {% include news-hub-item.html post=post %}
  {% endfor %}
</ul>
{% endif %}
