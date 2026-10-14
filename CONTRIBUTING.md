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
