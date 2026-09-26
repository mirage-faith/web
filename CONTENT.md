# Adding content to mirage.faith

Everything here deploys by `git push` (Cloudflare Workers Builds). No credentials, no build step for content. Two recurring jobs:

## 1. Add a Monthly Marriage Meetup teaching

The Library is manifest-driven: `public/mmm/library/index.json` lists the months, newest first, and the pages render themselves.

1. Make a slug folder: `public/mmm/library/YYYY-MM/`.
2. Drop in the files you have:
   - `handout-*.pdf` (the printable) — optional but usual.
   - a cover / graphic PNG — optional. If it has a transparent background, keep a transparent copy too (see the viewer note below); it sits seamlessly on cream.
   - Downsize big photos first: `sips -Z 1600 photo.jpg` (keeps them light; static assets are free but pages should stay fast).
3. Add an entry to `index.json`:
   ```json
   { "slug": "YYYY-MM", "date": "YYYY-MM-DD", "topic": "...", "summary": "...",
     "page": "YYYY-MM/", "handout": "YYYY-MM/handout-x.pdf", "cover": "YYYY-MM/cover.png",
     "source": "Adapted from ..." }
   ```
   - `page` → a detail page you author (rich month). Omit it and set only `handout` → the card links straight to the PDF (thin month; graduate later).
   - No `cover` → the index shows a warm gold fallback tile with the topic. Nothing looks broken when content is thin.
4. `git push`. Live in ~30s. The MMM page and Library index pick it up automatically.

Detail pages: copy `2026-09/index.html` as the template. Distillation style for the teaching text: translate ministry-leader source material for ordinary couples, warm, **zero em-dashes** (use parens/semicolons), credit the source prominently.

## 2. Make any image zoomable (the shared viewer)

Do NOT hand-build a per-image viewer (we did once; it was brittle). Use `public/viewer.html`, served at `/viewer`. It is generalized: it auto-detects the image's dimensions and needs no per-image code.

Link a figure to it with same-origin absolute paths:

```
/viewer?img=/mmm/library/2026-09/priority-structure-t.png&pdf=/mmm/library/2026-09/handout-priorities.pdf&back=/mmm/library/2026-09/&title=Priority+Structure
```

- `img` (required) — prefer a transparent PNG so it floats seamlessly on the cream background.
- `pdf` (optional) — shows a "Printable (PDF)" button.
- `back` (optional) — the back-link target.
- `title` (optional) — page title and image alt.
- In an HTML `href`, encode the `&` as `&amp;`.

Behavior (hard-won, do not "simplify" away):
- Opens at **Fit** (never wider than the page → mobile safe), zooms **Fit to 300%** in 25% steps.
- The image is `flex: none` so zoom actually grows it past the viewport and scrolls. (Default flex-shrink pinned it to page width — the "+ does nothing" bug.)
- Never anchor zoom to absolute pixels or cap at native resolution; both stalled zoom on common laptops. Zoom is relative to a viewport-computed fit width, recomputed on resize.
- Zoom buttons hide under 640px (pinch-to-zoom is natural on phones); the PDF label returns there.

Verify zoom-range changes with node (it is pure math) before shipping; a headless browser is only needed for true visual/layout QA.
