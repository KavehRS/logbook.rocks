(function () {
  'use strict';

  var form = document.querySelector('form.hub-filter');
  var lists = document.querySelectorAll('[data-hub-list]');
  if (!form || !lists.length) return;

  var input = form.querySelector('#hub-q');
  var items = [];
  lists.forEach(function (list) {
    list.querySelectorAll(':scope > li').forEach(function (item) {
      items.push(item);
    });
  });

  function apply(query) {
    var q = (query || '').trim().toLowerCase();
    if (input && input.value !== (query || '').trim()) {
      input.value = (query || '').trim();
    }
    items.forEach(function (item) {
      if (!q) {
        item.hidden = false;
        return;
      }
      var text = (item.textContent || '').toLowerCase();
      item.hidden = text.indexOf(q) === -1;
    });
  }

  var params = new URLSearchParams(window.location.search);
  apply(params.get('q') || '');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var q = input ? input.value.trim() : '';
    var url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    apply(q);
  });
})();
