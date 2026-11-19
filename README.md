# ECLIPSE Desert Retreat

Conceptual one-page retreat website. Next.js App Router, TypeScript, SCSS Modules, GSAP, Swiper and a three-step local demo reservation form. All 12 sections are implemented. Copy: ECLIPSE_website_copy.txt.

Run `npm install`, then `npm run dev`. Open http://127.0.0.1:3000. Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## GitHub Pages

Target: https://katechhka.github.io/eclipse-desert-retreat/

Push `main` to trigger `.github/workflows/pages.yml`. The workflow builds a static export in `out/` and deploys with GitHub Actions. Repository Settings → Pages → Source must be GitHub Actions.

Local project-path build in PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/eclipse-desert-retreat'
npm run build
```

`next.config.mjs` enables static export. `data/assets.ts` prefixes native image/srcset URLs; Sass receives the same prefix for backgrounds/cursors. Local development without the environment variable stays at `/`. GitHub Actions obtains the prefix from `configure-pages`.

Booking is demonstration-only: no payments, network submission, availability checks or email sending. Email mockups, internal working documents, original high-resolution source images, Word brief, screenshots, local artifacts and environment files are excluded from Git; production media in `public/images/` is included.
