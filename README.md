# Week in Omarchy

Static site for [weekinomarchy.com](https://weekinomarchy.com). It collects cited material from Omarchy News, the Omarchy manual, `omacom/omarchy` releases and themes, public dotfile repositories, and the Omarchy plugin marketplace catalog.

The original build lived in a private Cursor Origin draft and was not readable from this repository, so this tree was rebuilt from those public sources. Nothing here is filled in where a source was missing.

## Develop

```bash
npm ci
npm run dev
```

```bash
npm run build
```

The build writes `dist/`. Search is a browser filter over `/search-index.json`. RSS is `/rss.xml`. The sitemap is generated from `site` in `astro.config.mjs`.

Content rules are in [AGENTS.md](AGENTS.md). How to add a page, including a theme or plugin listing, is in [CONTRIBUTING.md](CONTRIBUTING.md). GitHub Pages and DNS are in [DEPLOY.md](DEPLOY.md).

Sponsorship mail goes to sponsors@weekinomarchy.com. Newsletter signup is a TODO placeholder and does not collect addresses.
