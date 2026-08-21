---
layout: default
title: خبر کوهنوردی
description: >-
  خبرهایی که توی منابع معتبر بین‌المللی می‌بینم و می‌خوانم را
  به‌صورت خلاصه در این بخش منتشر می‌کنم.
permalink: /news/
lang: fa-IR
dir_attr: rtl
---

<h1>خبر کوهنوردی</h1>
<p>خبرهایی که توی منابع معتبر بین‌المللی می‌بینم و می‌خوانم را به‌صورت خلاصه در این بخش منتشر می‌کنم.</p>
{% assign news_posts = site.news | sort: "date" | reverse %}
{% if news_posts.size == 0 %}
<p>هنوز خبری در این بخش منتشر نشده است.</p>
{% else %}
{% include hub-filter.html toolname="filter_news" tooldescription="Filter the published world news items listed on this page by title or summary text." %}
<ul data-hub-list>
  {% for post in news_posts %}
  <li style="margin-bottom: 15px; list-style: none; border-bottom: 1px solid #eee; padding-bottom: 10px;">
    <a href="{{ post.url }}" style="font-size: 1.2rem; font-weight: bold; text-decoration: none;">{{ post.title }}</a>
    {% if post.date %}
    <p class="meta" style="margin: 4px 0 0; color: #777; font-size: 0.9rem;">
      <time datetime="{{ post.date | date_to_xmlschema }}">{% include jalali-date.html date=post.date %}</time>
    </p>
    {% endif %}
    {% if post.description %}
    <p style="margin: 5px 0 0; color: #555; font-size: 0.95rem;">{{ post.description }}</p>
    {% elsif post.excerpt %}
    <p style="margin: 5px 0 0; color: #555; font-size: 0.95rem;">{{ post.excerpt | strip_html | truncatewords: 22 }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}
