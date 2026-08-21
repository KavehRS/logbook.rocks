# logbook.rocks

گزارش صعود و اخبار کوهنوردی کاوه‌ رضائی‌شیراز.

- سایت: https://logbook.rocks
- گزارش صعود: https://logbook.rocks/logbook/
- خبر کوهنوردی: https://logbook.rocks/news/
- سایت شخصی نویسنده: https://www.kavehrs.com

محتوای گزارش صعود، قوانین ایجنت، مهارت‌ها و هدف‌گذاری SEO از ریپوی `KavehRS/website` به اینجا منتقل شده است.

## توسعه محلی

```bash
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

Build:

```bash
bundle exec jekyll build
```

## استقرار

- **GitHub Pages:** گردش‌کار `.github/workflows/deploy-pages.yml` سایت را از شاخهٔ `main` می‌سازد و منتشر می‌کند.
- **Cloudflare:** دامنه روی کلادفلر است (`ken` / `melina` NS). خروجی Jekyll `_site` است؛ `wrangler.toml` برای Cloudflare Pages تنظیم شده (`pages_build_output_dir = "_site"`).
