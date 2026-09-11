# Juan Puentes Website

Juan's bilingual investor website, with a Three.js growth chart and rotating
Colombia-to-Australia globe. The frontend uses strict TypeScript and Vite.

## Local Development

Use Node.js 24 LTS (minimum 22.12) and run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. It chooses another port if its default port
is occupied. TypeScript source must be served through Vite, not opened directly
as an HTML file.

## Source Files

- `index.html`: page markup and initial content.
- `styles.css`: layout, responsive breakpoints, light and dark themes.
- `src/main.ts`: navigation, theme, contact form, and Calendly links.
- `src/translations.ts`: matching English and Spanish dictionaries.
- `src/profile.ts`: profile types and validation of fetched JSON.
- `src/hero-scene.ts`: Three.js chart, globe, rotation, and resize behavior.
- `data/profile.json`: refreshed public profile data and translated biography.
- `scripts/update-profile-data.mjs`: existing Node script that refreshes data.

## Verification

```sh
npm test
npm run build
npm run test:browser
```

The build runs the TypeScript compiler before Vite. Type errors fail the build.
The browser suite uses installed Chrome locally and Playwright Chromium in CI.
It checks laptop/mobile layouts, canvas pixels and motion, resizing, language
and theme persistence, contact links, and unavailable profile/WebGL fallbacks.

## Dev Preview

Pushing the `dev` branch runs `publish-dev-preview.yml`, builds into `dist/`,
and publishes those generated files into the production branch's `dev/` folder:

https://juanpuentesb.com/dev/

The production root is not changed by this workflow. The relative asset base
allows the build to work at both `/` and `/dev/`. Public profile JSON stays at
`data/profile.json` so the existing data-refresh job retains its input path.
Vite generates hashed asset filenames for cache updates. Do not edit generated
`dist/` files; change the source and rebuild.

The older tracked `dev/` and `vendor/` folders are legacy copies, not the active
TypeScript source or build inputs. The preview workflow publishes only `dist/`.
Future production promotion must publish a verified build, rather than copying
TypeScript source into the public root.
