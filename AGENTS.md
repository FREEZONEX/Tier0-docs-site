# Tier0 Docs — contributor & agent guide

Documentation site for [Tier0](https://tier0.app), built with Astro Starlight. Serves humans and AI agents (llms.txt is a first-class output).

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # MUST pass before committing — also regenerates llms*.txt
npm run preview   # serve the production build
```

## Where things live

| Path | What it is |
|---|---|
| `src/content/docs/` | All pages (md/mdx). URL = file path. |
| `astro.config.mjs` | Sidebar/nav, mermaid + llms.txt plugins, site URL |
| `src/styles/custom.css` | The entire theme — sectioned by comments, no other style sources |
| `src/components/PageTitle.astro` | Override that renders edition badges from frontmatter |
| `src/content.config.ts` | Frontmatter schema (`editions` field) |
| `.claude/launch.json` | Dev-server config for Claude Code preview |

## Hard conventions (do not break)

### 1. Editions = frontmatter metadata, never separate doc trees

Tier0 ships as **Edge** (open source), **Cloud** (SaaS), **Enterprise** (private). One docs tree serves all three:

```yaml
---
title: Analytics
editions: [cloud, enterprise]   # omit entirely on edition-agnostic pages
---
```

- Badges render automatically under the h1.
- Where editions diverge hard (install/setup), use `<Tabs syncKey="edition">` — the reader's choice persists site-wide.
- Pages exclusive to Cloud/Enterprise get a short `:::note[Edge edition]` aside pointing Edge users to their alternative.

### 2. Diagrams = Mermaid only

No ASCII art, no images-of-diagrams. Use ```mermaid code fences (rendered by astro-mermaid, auto light/dark). Highlight the key node with:

```
classDef t0accent fill:#B2ED1D,stroke:#73B200,color:#171717
class myNode t0accent
```

### 3. Typography = Stripe docs rules

System font stack for ALL text (no webfonts for prose), Source Code Pro for code only, **zero letter-spacing anywhere**, weights 400/500/700 only. Content 16px/26px; UI chrome 14px; headings 32/21/16 at 700.

### 4. Color = Tier0 neutral + lime, and NO BLUE

Dark canvas `#161616` (neutral gray, never blue-tinted), lime `#B2ED1D` / deep green `#73B200` as accents. Blue is banned everywhere — including code-syntax themes (we use vitesse-dark/light for this reason) and aside variants (note is restyled gray).

### 5. Writing rules

- **Tier0** is spelled with a zero. **FREEZONEX** is all caps.
- Answer first, then explain. Real commands over prose.
- Content must read well as plain Markdown — it ships verbatim into `/llms.txt`, `/llms-full.txt`, and the Edge subset. No meaning carried only by layout.

## Layout notes (if you touch custom.css)

- Doc pages: content+TOC group is capped (`--sl-content-width` + 3rem + 17rem) and centered; the TOC rail hugs the content. Don't reintroduce fixed-position TOC widths without checking 1440/2000/2560 widths.
- Homepage is a wireframe layout (`.t0-*` classes, `not-content` sections) with its own 66rem cap.
- Edition board on Choosing the Best Version uses `.t0-board` / `.t0-col` / `.t0-plan`.

## Known TODOs before going live

1. `site` in astro.config.mjs is a placeholder (`https://docs.tier0.app`) — set the real domain (llms.txt links depend on it; also update the llms-full.txt URL inside the homepage copy-prompt).
2. ~~Edit-link repo~~ — done: `github.com/FREEZONEX/Tier0-docs-site`.
3. Prices on Choosing the Best Version are snapshots — sync with tier0.app/pricing before release.
4. No CI yet — recommend a workflow that runs `npm run build` on PRs.
