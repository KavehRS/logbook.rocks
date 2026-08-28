(function () {
  'use strict';

  var form = document.querySelector('form.hub-filter');
  var lists = document.querySelectorAll('[data-hub-list]');
  if (!lists.length) return;

  var input = form ? form.querySelector('#hub-q') : null;
  var params = new URLSearchParams(window.location.search);

  var hubs = [];
  lists.forEach(function (list, index) {
    var size = parseInt(list.getAttribute('data-hub-page-size') || '0', 10) || 0;
    var key = list.getAttribute('data-hub-page-key') || 'p' + index;
    var page = parseInt(params.get(key) || '1', 10) || 1;
    if (page < 1) page = 1;
    hubs.push({
      list: list,
      items: Array.prototype.slice.call(list.querySelectorAll(':scope > li')),
      pageSize: size,
      key: key,
      page: page,
      pager: null,
      prevBtn: null,
      nextBtn: null,
      status: null
    });
  });

  function faNum(n) {
    return String(n).replace(/\d/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  function query() {
    return input ? input.value.trim() : (params.get('q') || '').trim();
  }

  function matching(hub, q) {
    var needle = (q || '').toLowerCase();
    if (!needle) return hub.items.slice();
    return hub.items.filter(function (item) {
      return (item.textContent || '').toLowerCase().indexOf(needle) !== -1;
    });
  }

  function makePager(hub) {
    var nav = document.createElement('nav');
    nav.className = 'news-hub-pager';
    nav.setAttribute('aria-label', 'صفحه‌بندی این ستون');
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.textContent = 'قبلی';
    var status = document.createElement('span');
    status.className = 'news-hub-pager-status';
    var next = document.createElement('button');
    next.type = 'button';
    next.textContent = 'بعدی';
    prev.addEventListener('click', function () {
      hub.page -= 1;
      apply(query(), hub.key);
    });
    next.addEventListener('click', function () {
      hub.page += 1;
      apply(query(), hub.key);
    });
    nav.appendChild(prev);
    nav.appendChild(status);
    nav.appendChild(next);
    hub.list.parentNode.appendChild(nav);
    hub.pager = nav;
    hub.prevBtn = prev;
    hub.nextBtn = next;
    hub.status = status;
  }

  function apply(q, changedKey) {
    var needle = (q || '').trim();
    if (input && input.value !== needle) input.value = needle;

    hubs.forEach(function (hub) {
      var shown = matching(hub, needle);
      hub.items.forEach(function (item) {
        item.hidden = true;
      });

      if (!hub.pageSize) {
        shown.forEach(function (item) {
          item.hidden = false;
        });
        return;
      }

      if (!hub.pager) makePager(hub);

      var pages = Math.max(1, Math.ceil(shown.length / hub.pageSize) || 1);
      if (changedKey == null) hub.page = 1;
      if (hub.page > pages) hub.page = pages;
      if (hub.page < 1) hub.page = 1;

      var start = (hub.page - 1) * hub.pageSize;
      shown.slice(start, start + hub.pageSize).forEach(function (item) {
        item.hidden = false;
      });

      var needPager = shown.length > hub.pageSize;
      hub.pager.hidden = !needPager;
      if (needPager) {
        hub.status.textContent =
          'صفحه ' + faNum(hub.page) + ' از ' + faNum(pages);
        hub.prevBtn.disabled = hub.page <= 1;
        hub.nextBtn.disabled = hub.page >= pages;
      }
    });

    var url = new URL(window.location.href);
    if (needle) url.searchParams.set('q', needle);
    else url.searchParams.delete('q');
    hubs.forEach(function (hub) {
      if (!hub.pageSize) return;
      if (hub.page > 1) url.searchParams.set(hub.key, String(hub.page));
      else url.searchParams.delete(hub.key);
    });
    history.replaceState(null, '', url);
  }

  apply(params.get('q') || '', 'init');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply(query(), null);
    });
  }
})();
