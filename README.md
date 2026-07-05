# Tier0 Docs

Documentation site for [Tier0](https://tier0.app) — the agentic industrial platform — built with [Astro Starlight](https://starlight.astro.build).

Human-friendly and agent-readable: every build emits `/llms.txt`, `/llms-small.txt`, `/llms-full.txt`, and an Edge-only subset via [starlight-llms-txt](https://github.com/delucis/starlight-llms-txt).

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/ — must pass before committing
npm run preview   # preview the production build
```

Requires Node 18+. No other services needed.

## Structure

```
src/content/docs/                  # pages — URL mirrors the file path
├── index.mdx                      # wireframe landing
├── get-started/
│   ├── installation.mdx           # CLI via Skill/GitHub + edition tabs
│   ├── demo-factory.mdx           # Cloud trial tour
│   └── choosing-version.mdx       # edition board + hw requirements + matrix
├── using-tier0/
│   ├── uns-concepts.mdx           # Metric/State/Action, VQT, storage (skeleton)
│   ├── connect-data.md            # modeling + SourceFlow
│   ├── working-with-uns-data.mdx  # MQTT / API / CLI (skeleton)
│   ├── build-apps.mdx             # containers as apps + Event Flow (skeleton)
│   ├── analyze-data.md            # Notebook, interactive + ML
│   └── agents.mdx                 # Tier0 Skill (skeleton)
└── best-practice/
    ├── uns-modeling.mdx           # topic explosion, payloads (skeleton)
    ├── protocol-connections.mdx   # OPC UA/Modbus flows + JSON refs (skeleton)
    └── analytics-apps.mdx         # Aramco Bowtie case (skeleton)

astro.config.mjs                   # sidebar, plugins (mermaid, llms.txt), site URL
src/styles/custom.css              # the entire theme, sectioned by comments
src/components/PageTitle.astro     # renders edition badges from frontmatter
src/content.config.ts              # frontmatter schema (editions field)
```

**Skeleton pages** carry a `:::caution[TODO — 写作线索]` block with writing directions — search the repo for `写作线索` to list everything awaiting content.

## Adding a page

1. Create `src/content/docs/<section>/<slug>.md` (use `.mdx` only if you need components):

   ```yaml
   ---
   title: My Page
   description: One sentence — this feeds search and llms.txt.
   editions: [cloud, enterprise]   # omit if the page applies to all editions
   ---
   ```

2. Add it to the `sidebar` in `astro.config.mjs`.
3. `npm run build` — a broken internal link or bad frontmatter fails the build.

## Conventions

The complete, binding conventions live in [AGENTS.md](AGENTS.md) (symlinked as `CLAUDE.md`, so AI coding tools load them automatically). Headlines:

- **Editions are frontmatter metadata** — one docs tree, never per-edition trees.
- **Diagrams are Mermaid only** — no ASCII art; brand-highlight nodes with `classDef t0accent`.
- **Typography = Stripe rules** — system fonts, mono for code only, zero letter-spacing.
- **Colors = neutral gray + Tier0 lime, no blue anywhere.**
- **Tier0** with a zero; **FREEZONEX** all caps; answer-first writing.

## Before going live (open TODOs)

| Item | Where |
|---|---|
| Set the real docs domain (currently `https://docs.tier0.app` placeholder) | `site` in `astro.config.mjs` |
| Re-verify prices against tier0.app/pricing | `architecture/choosing-version.mdx` |
| Add CI running `npm run build` on PRs | — |
