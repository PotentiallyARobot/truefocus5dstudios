# TrueFocus5DStudios website recovery archive

Backup of the public Wix website, captured October 2, 2026, for rebuilding and migration.

Source: https://ace02789.wixsite.com/truefocus5dstudios

The root `index.html` displays the TrueFocus homepage. Open `backup-index.html` to browse the recovery archive. This is a recovery archive, not a standalone working Wix application.

## Contents

- `pages/`: captured HTML, with the LegalZoom banner removed, for all 10 pages listed in the Wix sitemap.
- `local-pages/`: convenience copies with downloaded asset references rewritten where available. Wix runtime services may still require network access.
- `text/`: extracted page text.
- `assets/`: 4,016 downloaded assets, including images, styles, scripts, fonts, and two background videos in four resolutions each, through 1080p.
- `manifest.json`: original URLs, local paths, download outcomes, sizes, and verification results.
- `sitemap.xml`, `pages-sitemap.xml`: captured public sitemaps.
- `dns-backup.zone`: existing Wix DNS configuration, including Google Workspace mail records; no DNS changes have been made.
- `BACKUP-NOTES.txt`: coverage and limitations.
- `*.cjs`: Windows/Node.js download and verification utilities using curl.exe. These are capture utilities, not a website build system.

## Remaining migration work

Embedded YouTube videos are represented by their URLs; their video files are not included. Wix forms, newsletter, login, chat, payments, and dynamic library/backend data require separate export or rebuilding. Four Wix payment scripts returned HTTP 403. Additional dependencies from Wix's global font catalog are listed but were not downloaded.

The downloadable ZIP is not duplicated in this repository; the extracted backup is committed directly.

LegalZoom branding was removed from all saved page variants. The earlier ZIP remains the original capture. This change does not complete the standalone GitHub Pages rebuild.

Navigation-only fix: navigation.js and navigation.css retain the original saved design while enabling local menu links, click/keyboard conversion dropdowns, and Escape/outside-click dismissal. The full redesign was reverted.
