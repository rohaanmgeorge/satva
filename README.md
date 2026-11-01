# SATVA — Code for future

Website for **SATVA** (Soft Alliance for Technology, Vision & AI).

Next.js 15 · Tailwind v4 · GSAP + ScrollTrigger · Lenis · three.js / react-three-fiber

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing content
All copy (events, projects, team, socials, join form link, email) lives in `lib/content.ts`.
Replace the placeholder team names, dates, `site.email` and `site.joinUrl` before launch.
Live at https://satva-club.vercel.app (override with `NEXT_PUBLIC_SITE_URL` if the domain changes).

## How the scroll "film" works
One fixed WebGL particle field (`components/canvas/NeuralScene.tsx`) morphs between five
shapes (orb → neural net → "SATVA" → DNA helix → globe, built in `components/canvas/shapes.ts`).
Each section sets `data-morph` / `data-opacity`, and `components/Experience.tsx` scrubs the scene
between them as you scroll. The pinned `ScrollFilm` section drives morphs 2→4 like a video timeline.
