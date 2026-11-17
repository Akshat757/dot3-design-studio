# DOT3 Design Studios — Portfolio Site Plan (v2)

The client wants a simple portfolio site. The visualiser, estimator, dashboard, journal, materials catalogue and the rest of the demo are out of scope.
The full demo is preserved at tag `demo-v1` and branch `archive/full-demo` (old plan: `docs/archive/demo-plan.md`).

## Decision: same repo, trim in place (not a new project)

Next.js 15 static export, Tailwind 4, `motion`, the WhatsApp helper (`src/lib/whatsapp`), the consultation booking and the design tokens already exist and are reusable. A fresh start would rebuild them. We cut the demo features on `main` and keep the demo safe on the archive branch.

## Scope (4 things only)

1. **Portfolio**: `/projects` grid plus `/projects/[slug]` case pages built from the client's renders (`dot3_photos/`).
2. **Needs questionnaire** (`/questionnaire`): ~15 questions, one per screen, progress bar, results sent to the studio WhatsApp as a formatted message.
3. **Book a consultation** (`/consultation`): keep the existing page, simplified.
4. **Landing page**: animated and eye-catching (see Phase 3).

Supporting pages: About/Studio (short), Contact (WhatsApp, phone, address, map link), 404. Nav: Home, Projects, Find your needs, Book consultation.

## Phases

**Phase 0. Cleanup.** Remove the routes, components, lib code, tests and scripts for: visualiser, estimate, dashboard, journal, materials, rooms, styles, gallery, search, locations, services, testimonials, process, dev, legal (keep a minimal privacy page). Drop unused dependencies (konva, react-konva, @react-pdf/renderer, leaflet, minisearch, idb, heic2any, fflate, culori, MDX bits). Fix the 29 known type errors by deleting the code that causes them. Done when typecheck, lint, tests and build are green.

**Phase 1. Portfolio.** Convert renders to optimised web images (WebP and AVIF, blur placeholders). One data file `src/data/projects.ts`: title, location, type, area, year, brief, scope, materials, image list. Grid with type filter, case page with gallery and lightbox, next/previous project, a "Book a consultation" CTA. Needs the real details from the client (see questions).

**Phase 2. Questionnaire.** Questions as data in `src/data/questionnaire.ts` (property type, city/area, size, stage of construction, rooms to design, style likes, budget band, timeline, household, Vastu, storage needs, colours, must-haves, reference links, contact details). Zod validation, `react-hook-form`, answers saved locally so a refresh does not lose progress, a review step, then `wa.me/<studio number>?text=<summary>`. Includes a fallback "copy answers" button. A static site cannot send WhatsApp silently, so the user taps Send in WhatsApp; the plan is a prefilled message.

**Phase 3. Landing page animation.** Full-screen hero with a masked text reveal and an image-sequence or parallax of the best renders, a custom cursor with magnetic buttons, a scroll-driven horizontal project reel, a counter strip, section reveals and smooth scrolling, marquee of services, page transitions. Built with `motion` only (no heavy 3D). Respect `prefers-reduced-motion`, keep LCP good on mobile.

**Phase 4. Consultation and polish.** Simplify booking (name, phone, preferred slot, topic) to WhatsApp plus `.ics`. SEO and OG images, favicon from the supplied logo, accessibility pass, Lighthouse on mobile, Playwright smoke tests for the 4 flows.

**Phase 5. Deploy.** Static export to Cloudflare Pages / Netlify / GitHub Pages, custom domain.

## What I need from you / the client

- Studio WhatsApp number (with country code) and email/address.
- Per project: name, location, type, area, year, short description, which renders belong to it. Which of the files in `dot3_photos/` are renders vs. logo/reel images.
- The preferred questionnaire topics (or I draft the 15 and you approve).
- Logo and brand colours/fonts (name font file is in `dot3_photos/`).
- Domain and hosting preference.
