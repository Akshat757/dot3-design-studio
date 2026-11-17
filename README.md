# DOT THREE Design Studio — website

Portfolio site for DOT THREE Design Studio, Indore (architecture, interior, landscape, furniture).
Next.js 16 static export + Tailwind CSS 4. See `plan.md` for phases, `REQUIREMENTS.md` for content and open client questions, `QUESTIONNAIRE.md` for the needs questionnaire draft.

## Commands

| Command                                                 | What it does                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`                                           | Dev server on http://localhost:3000                                                               |
| `npm run build`                                         | Static site in `out/`                                                                             |
| `npm start`                                             | Serve `out/` locally                                                                              |
| `npm run typecheck` / `npm run lint` / `npm run format` | Checks and formatting                                                                             |
| `npm run images`                                        | Convert client images to WebP in `public/images` and update `src/data/image-sizes.generated.json` |

## Where things live

- `src/config/site.ts` — contact details and WhatsApp number (single source).
- `src/data/studio.ts` — services, process, philosophy, vision, team.
- `src/data/projects.ts` — every portfolio project, with the source image for each photo.
- `assets/` — raw client files (portfolio deck images, WhatsApp renders). Gitignored because of size; keep a copy on Drive.
- `reference/` — booking form and helpers from the earlier demo, to port in Phase 4, then delete.

The earlier full demo (visualiser, estimator, etc.) lives in `C:\DOT3_DesignStudios_Demo`.
