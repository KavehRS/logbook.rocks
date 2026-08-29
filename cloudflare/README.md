# Cloudflare origin for logbook.rocks

Live HTML for Iranian (and other filtered) networks must come from Cloudflare, not from a browser fetch to GitHub or jsDelivr.

`serve-published.js` is a Snippet/Worker that fetches the `published` branch from GitHub **on the edge** and returns it with the right `Content-Type`. The current zone is Cloudflare Free: Snippets are not allowed, Origin Host override is not allowed, and the zone API token cannot deploy Workers.

Until GitHub Pages source is branch `published` (see `AGENTS.md`), keep the Zaraz bootstrap. After that switch, disable Zaraz and the rewrite-every-path-to-`/` rule so `/news/` is a real Pages path.
