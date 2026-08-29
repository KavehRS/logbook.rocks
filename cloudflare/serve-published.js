/**
 * Cloudflare Snippet: serve the `published` Jekyll export from GitHub raw
 * via the Cloudflare edge. Visitors (including Iran) only talk to
 * logbook.rocks — they never fetch GitHub or jsDelivr in the browser.
 *
 * One subrequest only (snippet limit). Do not also fetch(request) except
 * for /cdn-cgi/.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname || "/";
    if (path.startsWith("/cdn-cgi/")) return fetch(request);
    if (path === "/" || path.endsWith("/")) path += "index.html";
    else {
      const last = path.split("/").pop() || "";
      if (last.indexOf(".") === -1) path += "/index.html";
    }
    const upstream =
      "https://raw.githubusercontent.com/KavehRS/logbook.rocks/published" + path;
    const res = await fetch(upstream, {
      headers: { "User-Agent": "logbook.rocks-origin" },
    });
    const headers = new Headers();
    headers.set("content-type", mime(path));
    headers.set("cache-control", "public, max-age=120");
    headers.set("x-logbook-origin", "published");
    return new Response(res.body, { status: res.status, headers });
  },
};

function mime(path) {
  const p = path.toLowerCase();
  if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html; charset=utf-8";
  if (p.endsWith(".css")) return "text/css; charset=utf-8";
  if (p.endsWith(".js") || p.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (p.endsWith(".json") || p.endsWith(".webmanifest") || p.endsWith(".map"))
    return "application/json";
  if (p.endsWith(".xml")) return "application/xml";
  if (p.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".gif")) return "image/gif";
  if (p.endsWith(".webp")) return "image/webp";
  if (p.endsWith(".ico")) return "image/x-icon";
  if (p.endsWith(".woff2")) return "font/woff2";
  if (p.endsWith(".woff")) return "font/woff";
  return "application/octet-stream";
}
