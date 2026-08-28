---
layout: default
title: خبر کوهنوردی
description: >-
  خبرهایی که توی منابع معتبر بین‌المللی می‌بینم و می‌خوانم را
  ترجمه می‌کنم و در این بخش منتشر می‌کنم.
permalink: /news/
lang: fa-IR
dir_attr: rtl
body_class: hub-wide
---

<h1>خبر کوهنوردی</h1>
<p>خبرهایی که توی منابع معتبر بین‌المللی می‌بینم و می‌خوانم را ترجمه می‌کنم و در این بخش منتشر می‌کنم.</p>
{% assign aaj_posts = site.news | where_exp: "post", "post.aaj_id" | sort: "aaj_id" %}
{% assign wire_posts = site.news | where_exp: "post", "post.aaj_id == nil" | sort: "date" | reverse %}
{% if wire_posts.size == 0 and aaj_posts.size == 0 %}
<p>هنوز خبری در این بخش منتشر نشده است.</p>
{% else %}
{% include hub-filter.html toolname="filter_news" tooldescription="Filter the published world news items listed on this page by title or summary text." %}
<div class="news-hub-split">
  <section class="news-hub-pane" aria-labelledby="news-hub-wire">
    <h2 id="news-hub-wire">اخبار جدید</h2>
    {% if wire_posts.size > 0 %}
    <ul data-hub-list>
      {% for post in wire_posts %}
      {% include news-hub-item.html post=post %}
      {% endfor %}
    </ul>
    {% else %}
    <p>هنوز خبر تازه‌ای در این ستون نیست.</p>
    {% endif %}
  </section>
  <section class="news-hub-pane" aria-labelledby="aaj-2026">
    <h2 id="aaj-2026">ترجمه مقالات</h2>
    <p class="news-hub-note">American Alpine Journal ۲۰۲۶، به ترتیب جلد از قدیم به جدید.</p>
    {% if aaj_posts.size > 0 %}
    <ul data-hub-list>
      {% for post in aaj_posts %}
      {% include news-hub-item.html post=post %}
      {% endfor %}
    </ul>
    {% else %}
    <p>هنوز مقاله‌ای در این ستون نیست.</p>
    {% endif %}
  </section>
</div>
{% endif %}
