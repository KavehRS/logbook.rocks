(function () {
  if (window.__logbookBoot) return;
  window.__logbookBoot = true;

  var sha = window.__LOGBOOK_SHA || "published";
  var mirrors = [
    "https://cdn.jsdelivr.net/gh/KavehRS/logbook.rocks@",
    "https://fastly.jsdelivr.net/gh/KavehRS/logbook.rocks@",
    "https://gcore.jsdelivr.net/gh/KavehRS/logbook.rocks@"
  ];

  function filePath(p) {
    if (!p || p === "/") return "/index.html";
    if (p.endsWith("/")) return p + "index.html";
    var last = p.split("/").pop();
    if (last.indexOf(".") === -1) return p + "/index.html";
    return p;
  }

  function rewrite(h, cdn) {
    h = h.replace(/\ssrc="\//g, ' src="' + cdn + '/');
    h = h.replace(/\ssrcset="\//g, ' srcset="' + cdn + '/');
    h = h.replace(/\sposter="\//g, ' poster="' + cdn + '/');
    h = h.replace(/url\(\//g, "url(" + cdn + "/");
    h = h.replace(
      /href="\/(assets|favicon|apple-touch|android-chrome|mstile|site\.webmanifest|robots\.txt)/g,
      "href=\"" + cdn + "/$1"
    );
    return h;
  }

  function paint(h, cdn) {
    document.open();
    document.write(rewrite(h, cdn));
    document.close();
  }

  function get(url, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () {
      ctrl.abort();
    }, ms);
    return fetch(url, {
      mode: "cors",
      credentials: "omit",
      cache: "force-cache",
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    });
  }

  function fail() {
    var el = document.getElementById("lb-boot");
    if (el) el.textContent = "بارگذاری صفحه طول کشید. یک بار دیگر تلاش کنید.";
  }

  function tryMirror(i) {
    if (i >= mirrors.length) {
      fail();
      return;
    }
    var cdn = mirrors[i] + sha;
    var url = cdn + filePath(location.pathname);
    get(url, 8000)
      .then(function (h) {
        paint(h, cdn);
      })
      .catch(function () {
        return get(url + (url.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now(), 8000).then(
          function (h) {
            paint(h, cdn);
          }
        );
      })
      .catch(function () {
        tryMirror(i + 1);
      });
  }

  tryMirror(0);
})();
