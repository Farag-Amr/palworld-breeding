# Palworld Breeding Calculator

Unofficial fan site for planning Palworld breeding: pick two parents to see the child, browse every Pal with the parent pairs that produce it and more.

This repo is a **usable tool** and a **learning project**. It uses a 2026 frontend stack. Next.js App Router, TypeScript, Tailwind CSS, and static JSON instead of a database.

Palworld and Pal names/art belong to Pocketpair, Inc. This is not affiliated with them.

## Why this architecture

Palworld has roughly 300 Pals. The browser can calculate a pair result (and even scan all pairs) in milliseconds. A server database would add hosting cost and currently uneeded complexity without helping v1 of this project.

| Layer | Role |
| --- | --- |
| `src/data` | Facts: Pal list and unique combos (generated JSON) |
| `src/lib` | Rules: breeding formula as testable TypeScript |
| `src/components` | Screens: pickers, results, expandable Paldex list |
| `src/app` | Routes: which URL shows which screen |

## Stack

- **Next.js** (App Router) — pages, local dev server, production build
- **TypeScript** — typed Pal records and function arguments
- **Tailwind CSS** — layout and theme in the markup
- **Static JSON** — Paldex data shipped with the site
- **GitHub** — source history and portfolio

## Local development

Requires [Node.js 20.9+](https://nodejs.org/).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run build-data` | Rebuild `src/data` JSON from files in `vendor/` |
| `npm run fetch-pal-icons` | Copy pal portraits from `vendor/palarium/assets/pals` into `public/pals` |

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for PalCalc (MIT), combo-table credit, and pal portrait source.

## Roadmap

- [x] Next.js scaffold and GitHub repo
- [x] Pal JSON data and unique-combo table
- [x] Breeding engine (`getChild`)
- [x] Two-parent calculator
- [ ] Parent reverse lookup
- [x] Numbered Paldex list with pal portraits
- [ ] Paldex expandable parent combinations
- [ ] Later: breeding matrix and shortest path

## License

Source code in this repository is available for learning. Game data and Pal imagery remain subject to Pocketpair’s rights and to licenses of any community datasets we import (credited when added).
