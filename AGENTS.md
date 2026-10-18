# Content schema

Week in Omarchy is a static site. Every page under Issues, Themes, Setups, Fixes, Releases, and Tools is a Markdown file in `src/content/` with the frontmatter below. Astro checks that frontmatter at build time (`src/content.config.ts`).

Do not add a fact that is not in a cited source. Do not estimate star counts, invent dates, or paraphrase a repository into a description it did not publish. If a source does not say it, leave it out.

## issues

`src/content/issues/<id>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | |
| `date` | `YYYY-MM-DD` | The issue date, UTC. |
| `summary` | string | One or two sentences used on cards, in search, and in RSS. |
| `sources` | list | At least one `{ title, url, published }`. `published` is `YYYY-MM-DD`. |

The body may only restate those sources.

## themes

`src/content/themes/<directory-name>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | Caption from `manual/06-themes.md`. When that gallery does not caption the directory, the name printed in the cited release notes. |
| `gallery` | boolean | True when `manual/06-themes.md` captions the theme. |
| `order` | integer | Position in that gallery. Directories the gallery does not caption follow it, in directory-name order. |
| `summary` | string | |
| `mode` | `dark` or `light` | `mode` in `colors.toml`. |
| `accent`, `background`, `foreground` | `#RRGGBB` | Those keys in `colors.toml`. |
| `directory` | string | `themes/<name>`. |
| `repo` | URL | Git tree for that directory. |
| `manual` | URL | Themes chapter. |
| `colors` | URL | `colors.toml`. |
| `preview` | path | Local copy of `preview.png`, served from `public/`. |
| `release` | URL, optional | Release notes that name a theme the gallery does not caption. |

## setups

`src/content/setups/<id>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | `owner/name`. |
| `summary` | string | GitHub `description`, whitespace trimmed. |
| `repo` | URL | |
| `description` | string | Same text as `summary`. |
| `license` | string or null | SPDX id from the API, or null when the API has no license. |
| `stars` | integer | `stargazers_count` on `fetchedAt`. |
| `defaultBranch` | string | |
| `pushedAt` | ISO-8601 | |
| `fetchedAt` | `YYYY-MM-DD` | Day the API was read. |

Only list a repository whose own description says it is an Omarchy configuration.

## fixes

`src/content/fixes/<id>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | The remedy, not a new claim. |
| `order` | integer | Reading order in the troubleshooting chapter. |
| `summary` | string | |
| `heading` | string | The manual heading this step comes from. |
| `manual` | URL | Anchor on the published troubleshooting page. |
| `source` | URL | `manual/45-troubleshooting.md` on quattro. |

Commands and paths in the body must match the manual.

## releases

`src/content/releases/<id>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | Git tag, such as `v4.0.4`. |
| `version` | string | Tag without `v`. |
| `date` | `YYYY-MM-DD` | GitHub `published_at`, UTC. |
| `summary` | string | Opening paragraph of the release notes. |
| `releaseUrl` | URL | |
| `iso` | URL | |
| `sha256` | 64 hex chars | The SHA256 line in the notes. |
| `upgrade` | string | The upgrade sentence in the notes. |

## tools

`src/content/tools/<id>.md`

| Field | Type | Rule |
| --- | --- | --- |
| `title` | string | Catalog `name`. |
| `order` | integer | Rank among the selected listings. |
| `summary` | string | Catalog `description`, unmodified. |
| `pluginId` | string | Catalog `id`. |
| `author`, `version`, `category`, `kind` | string | Catalog fields. |
| `repo` | URL | Catalog `repo`. |
| `stars` | integer | Catalog `stars` at `catalogGeneratedAt`. |
| `license` | string | Catalog `license`. |
| `installCommand` | string | Catalog `installCommand`. |
| `verificationStatus` | string | Catalog field. Do not change it. |
| `catalogGeneratedAt` | ISO-8601 | `generatedAt` of `site/catalog.json`. |
| `addedAt` | `YYYY-MM-DD` | Catalog `addedAt`. |
| `tags` | list of strings | Catalog `tags`. |
| `preview` | path, optional | Local copy of the catalog `previewImage`, when that field is non-empty. Omit the key when the catalog has no preview. |

The current tool set is the installable GitHub listings with a non-empty `installCommand` and a `stars` field of at least 40 in the catalog generated at `catalogGeneratedAt`. Equal stars are ordered by name. Say so on the page when that rule changes.

## Counts the build checks

`src/lib/catalog.ts` fails the build unless the collections contain 2 issues, 22 themes, 5 setups, 11 fixes, 8 releases, and 45 tools. Update `expectedCounts` in the same commit that changes a count, and say why in the commit message.
