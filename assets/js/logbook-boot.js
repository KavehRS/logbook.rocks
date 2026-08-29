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

  function load(base) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () {
      ctrl.abort();
    }, 2500);
    var url = base + filePath(location.pathname);
    return fetch(url, {
      mode: "cors",
      credentials: "omit",
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error(String(r.status));
      return r.text().then(function (h) {
        return { h: h, base: base };
      });
    });
  }

  function firstOk(promises) {
    return new Promise(function (resolve, reject) {
      var pending = promises.length;
      var lastErr;
      for (var i = 0; i < promises.length; i++) {
        promises[i].then(resolve, function (err) {
          lastErr = err;
          pending -= 1;
          if (pending === 0) reject(lastErr);
        });
      }
    });
  }

  function fail() {
    var el = document.getElementById("lb-boot");
    if (el) el.textContent = "بارگذاری صفحه طول کشید. یک بار دیگر تلاش کنید.";
  }

  firstOk(
    mirrors.map(function (prefix) {
      return load(prefix + sha);
    })
  )
    .then(function (res) {
      paint(res.h, res.base);
    })
    .catch(fail);
})();
