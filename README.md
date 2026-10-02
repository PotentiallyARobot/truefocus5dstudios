# TrueFocus 5D Studios

Standalone static website. The root index.html is the homepage. Publish the repository root with GitHub Pages; relative links work under a repository subpath or a custom domain.

## Website

- Ten responsive pages, with compatible routes in pages/ and local-pages/.
- Shared site.css and site.js: responsive grids, a mobile menu, click-to-open conversion dropdown, keyboard focus, Escape dismissal, and current-page indicators.
- TrueFocus branding only. No Wix or LegalZoom banners or runtime dependencies.
- Downloaded posters and demonstration video, plus responsive YouTube embeds with external watch links.
- Contact links open the user's email application. Newsletter, checkout and other Wix backend features are not active. The payment page directs enquiries to the studio.

## Development

Requires Node.js. No package installation or framework build is needed to serve the committed site.

    node build-site.cjs
    node check-site.cjs
    node preview.cjs

Preview: http://127.0.0.1:4174

Edit build-site.cjs for shared templates, site-content.json for preserved page copy, and site.css / site.js for presentation and navigation. The builder regenerates all published HTML routes.

## Recovery materials

The assets, extracted text, manifest, captured sitemaps, and DNS backup retain the recovery materials from October 2, 2026. The manifest describes the original download and records subsequent page changes. The earlier ZIP is the original capture. Historical download/finalization/banner-removal/verification utilities are capture tools and should not be run over the rebuilt site.

## Validation

check-site.cjs checks all 30 public/compatibility routes, local asset/link targets, viewport metadata, navigation and absence of Wix runtime/branding. Mobile menu expansion, conversion submenu navigation, and contact navigation were checked in Chrome at 390px and 320px without horizontal overflow.
