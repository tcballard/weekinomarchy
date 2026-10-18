# Contributing

Week in Omarchy publishes only what a source already says. Read [AGENTS.md](AGENTS.md) before adding a page. That file is the content schema.

## Add an entry

1. Add a Markdown file under the matching directory in `src/content/`.
2. Fill every frontmatter field the schema requires. Copy descriptions, commands, checksums, and dates from the source.
3. Link the source in the body or in `sources`.
4. If the new file changes how many entries a section has, update `expectedCounts` in `src/lib/catalog.ts` and the selection note in `sectionMeta`.
5. Build:

```bash
npm ci
npm run build
```

The build fails when frontmatter does not match the schema or a section count drifts.

## Submit a theme or tool listing

Open a pull request. Do not mail a listing in.

A theme needs a directory under `themes/` on the quattro branch of omacom/omarchy, with `colors.toml` and `preview.png`. Copy `mode`, `accent`, `background`, and `foreground` from that file, and put a local copy of `preview.png` in `public/themes/`. If `manual/06-themes.md` captions the theme, `title` is that caption, `gallery` is true, and `order` is its position in the gallery. If the gallery does not caption it, `title` is the name a cited release note prints, `gallery` is false, `release` is that note’s URL, and `order` continues after the gallery in directory-name order. A directory that neither the gallery nor a release note names stays out of the collection; say so in the themes note in `src/lib/catalog.ts`.

A tool needs an entry in `site/catalog.json` of omacom/omarchy-plugin-marketplace. Copy `name`, `description`, `id`, `author`, `version`, `category`, `kind`, `repo`, `stars`, `license`, `installCommand`, `verificationStatus`, `addedAt`, and `tags` unchanged, and set `catalogGeneratedAt` to that file’s `generatedAt`. The page’s set is every installable GitHub listing in that file with a non-empty install command and at least 40 stars. Copy `previewImage` into `public/tools/` only when the catalog entry has one. Rank `order` by stars descending, then by name.

When refreshing the tool catalog, update the pinned catalog source link in `src/lib/catalog.ts` and the source revision in `public/asset-notices.txt` to match `catalogGeneratedAt`. Retain upstream licence notices when copying images or catalog content.

## What not to add

- A star count, date, or checksum you did not read from the source on the day you record in `fetchedAt` or `catalogGeneratedAt`.
- A theme, plugin, or setup that the cited page does not list.
- A newsletter form that stores addresses. The homepage placeholder stays until a provider is actually wired.
- Sponsorship prices or benefits. The sponsor page is the address `sponsors@weekinomarchy.com`.

## Preview

```bash
npm run dev
```

Search is client-side and reads `/search-index.json`, which exists after a build or while the dev server is running.
