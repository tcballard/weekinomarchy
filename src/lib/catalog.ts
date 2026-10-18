import { getCollection, getEntry, render } from 'astro:content';

export const sectionIds = ['issues', 'themes', 'setups', 'fixes', 'releases', 'tools'] as const;
export type SectionId = (typeof sectionIds)[number];

export const expectedCounts: Record<SectionId, number> = {
  issues: 2,
  themes: 22,
  setups: 5,
  fixes: 11,
  releases: 8,
  tools: 45,
};

export const sectionMeta: Record<
  SectionId,
  { title: string; lede: string; note: string }
> = {
  issues: {
    title: 'Issues',
    lede: 'Two issues: Omarchy News from October 2–9, 2026, and releases 4.0.3 and 4.0.4.',
    note: 'The October issue cites the three Omarchy News posts dated inside October 2–9, 2026. The other issue cites the GitHub release notes for v4.0.3 and v4.0.4.',
  },
  themes: {
    title: 'Themes',
    lede: 'Twenty-two themes from the Omarchy manual gallery and the quattro themes directory.',
    note: 'manual/06-themes.md on the quattro branch captions nineteen themes, Tokyo Night through White, and this page keeps that order. The same branch’s themes directory also contains last-horizon, lupine, and solitude. The v4.0.0 release notes name Last Horizon, Solitude, and Lupine, and those three follow the gallery. themes/starship is on that branch with colors.toml and preview.png, but the gallery does not caption it and those notes do not name it, so it is not listed. The manual’s opening line says Omarchy comes with twenty-two themes. Colors are mode, accent, background, and foreground from each colors.toml. Previews are that repository’s preview.png files.',
  },
  setups: {
    title: 'Setups',
    lede: 'Five public GitHub repositories whose descriptions identify an Omarchy desktop configuration.',
    note: 'Descriptions, licenses, star counts, default branches, and push times are the GitHub API repository fields fetched on October 14, 2026.',
  },
  fixes: {
    title: 'Fixes',
    lede: 'Eleven remedies from the troubleshooting chapter of the Omarchy manual.',
    note: 'manual/45-troubleshooting.md on the quattro branch has seven headings. Three of those headings contain more than one remedy, and those remedies are separate entries here. The other four headings are one entry each.',
  },
  releases: {
    title: 'Releases',
    lede: 'Eight Omarchy releases, from v3.8.2 through v4.0.4.',
    note: 'Includes v3.8.3 and v3.8.4. Dates are the GitHub published_at dates. SHA256 values are the checksums printed in the release notes. Shorter release notes are reproduced from the GitHub release; the v4.0.0 notes are summarized by their opening paragraphs and linked in full.',
  },
  tools: {
    title: 'Tools',
    lede: 'Forty-five plugin repositories from the Omarchy plugin marketplace catalog.',
    note: 'Taken from omacom/omarchy-plugin-marketplace site/catalog.json generated 2026-10-15T23:04:52.187Z. These are the installable GitHub listings with a non-empty install command and a stars field of at least 40. Equal stars are ordered by name. Descriptions, verification status, added dates, and preview images are that file’s. Five listings have no preview image there, so those cards do not show one. “Listed since” keeps entries whose addedAt is on or after the date 30 days before that catalog’s UTC date. The shell plugins chapter says omarchy plugin add tells you that plugins run as arbitrary, unsandboxed code inside the long-lived shell process.',
  },
};

export type Card = {
  href: string;
  title: string;
  summary: string;
  meta: string;
  swatches?: string[];
  preview?: { src: string; alt: string };
  mode?: 'dark' | 'light';
  gallery?: boolean;
  category?: string;
  recent?: boolean;
  recentSince?: string;
};

function catalogDay(iso: string) {
  return iso.slice(0, 10);
}

function daysBefore(day: string, days: number) {
  const [year, month, date] = day.split('-').map(Number);
  const value = new Date(Date.UTC(year, month - 1, date));
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString().slice(0, 10);
}

export type Fact = { label: string; value: string; href?: string };

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return formatDate(date);
}

export function hrefFor(section: SectionId, id: string) {
  return `/${section}/${id}/`;
}

export async function collections() {
  const [issues, themes, setups, fixes, releases, tools] = await Promise.all([
    getCollection('issues'),
    getCollection('themes'),
    getCollection('setups'),
    getCollection('fixes'),
    getCollection('releases'),
    getCollection('tools'),
  ]);
  const grouped = { issues, themes, setups, fixes, releases, tools };
  for (const id of sectionIds) {
    if (grouped[id].length !== expectedCounts[id]) {
      throw new Error(`${id} has ${grouped[id].length} entries; expected ${expectedCounts[id]}`);
    }
  }
  return grouped;
}

export async function cardsFor(section: SectionId): Promise<Card[]> {
  const grouped = await collections();
  switch (section) {
    case 'issues':
      return grouped.issues
        .slice()
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
        .map((entry) => ({
          href: hrefFor('issues', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: formatDate(entry.data.date),
        }));
    case 'themes':
      return grouped.themes
        .slice()
        .sort((a, b) => a.data.order - b.data.order)
        .map((entry) => ({
          href: hrefFor('themes', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: entry.data.gallery
            ? `${entry.data.mode} · manual gallery`
            : `${entry.data.mode} · not captioned in the manual gallery`,
          swatches: [entry.data.background, entry.data.accent, entry.data.foreground],
          preview: {
            src: entry.data.preview,
            alt: `${entry.data.title} preview from omacom/omarchy`,
          },
          mode: entry.data.mode,
          gallery: entry.data.gallery,
        }));
    case 'setups':
      return grouped.setups
        .slice()
        .sort((a, b) => a.data.title.localeCompare(b.data.title))
        .map((entry) => ({
          href: hrefFor('setups', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: `${entry.data.stars} stars on GitHub`,
        }));
    case 'fixes':
      return grouped.fixes
        .slice()
        .sort((a, b) => a.data.order - b.data.order)
        .map((entry) => ({
          href: hrefFor('fixes', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: `From “${entry.data.heading}”`,
        }));
    case 'releases':
      return grouped.releases
        .slice()
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
        .map((entry) => ({
          href: hrefFor('releases', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: formatDate(entry.data.date),
        }));
    case 'tools': {
      const generated = new Set(grouped.tools.map((entry) => entry.data.catalogGeneratedAt));
      if (generated.size !== 1) {
        throw new Error('Tool listings must share one catalogGeneratedAt');
      }
      const recentSince = daysBefore(catalogDay([...generated][0]), 30);
      return grouped.tools
        .slice()
        .sort((a, b) => a.data.order - b.data.order)
        .map((entry) => ({
          href: hrefFor('tools', entry.id),
          title: entry.data.title,
          summary: entry.data.summary,
          meta: `#${entry.data.order} · ${entry.data.category} · ${entry.data.stars} catalog stars · ${entry.data.verificationStatus}`,
          preview: entry.data.preview
            ? {
                src: entry.data.preview,
                alt: `${entry.data.title} preview from the Omarchy plugin marketplace catalog`,
              }
            : undefined,
          category: entry.data.category,
          recent: entry.data.addedAt >= recentSince,
          recentSince,
        }));
    }
  }
}

export async function loadEntry(section: SectionId, id: string) {
  switch (section) {
    case 'issues': {
      const entry = await getEntry('issues', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: formatDate(entry.data.date),
        Content: rendered.Content,
        facts: entry.data.sources.map((source, index) => ({
          label: `Source ${index + 1}`,
          value: `${source.title} (${source.published})`,
          href: source.url,
        })),
        swatches: [] as { name: string; hex: string }[],
        preview: null as { src: string; alt: string } | null,
        command: null as string | null,
        body: entry.body ?? '',
      };
    }
    case 'themes': {
      const entry = await getEntry('themes', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      const facts: Fact[] = [
        { label: 'Directory', value: entry.data.directory, href: entry.data.repo },
        { label: 'colors.toml', value: 'quattro branch', href: entry.data.colors },
        { label: 'Manual', value: 'Themes', href: entry.data.manual },
        { label: 'Mode', value: entry.data.mode },
        {
          label: 'Gallery caption',
          value: entry.data.gallery ? `Theme ${entry.data.order}` : 'Not in manual/06-themes.md',
        },
      ];
      if (entry.data.release) {
        facts.push({
          label: 'Release notes',
          value: entry.data.release.split('/').pop() ?? entry.data.release,
          href: entry.data.release,
        });
      }
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: entry.data.gallery
          ? `Theme ${entry.data.order} in the manual gallery`
          : 'In the quattro themes directory, not captioned in the manual gallery',
        Content: rendered.Content,
        facts,
        swatches: [
          { name: 'background', hex: entry.data.background },
          { name: 'accent', hex: entry.data.accent },
          { name: 'foreground', hex: entry.data.foreground },
        ],
        preview: { src: entry.data.preview, alt: `${entry.data.title} preview from omacom/omarchy` },
        command: null,
        body: entry.body ?? '',
      };
    }
    case 'setups': {
      const entry = await getEntry('setups', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      const facts: Fact[] = [
        { label: 'Repository', value: entry.data.title, href: entry.data.repo },
        { label: 'Stars', value: String(entry.data.stars) },
        { label: 'Default branch', value: entry.data.defaultBranch },
        { label: 'Pushed', value: formatWhen(entry.data.pushedAt) },
        { label: 'Fetched', value: entry.data.fetchedAt },
      ];
      if (entry.data.license) facts.splice(2, 0, { label: 'License', value: entry.data.license });
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: 'Public GitHub repository',
        Content: rendered.Content,
        facts,
        swatches: [],
        preview: null,
        command: null,
        body: entry.body ?? '',
      };
    }
    case 'fixes': {
      const entry = await getEntry('fixes', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: `Manual heading: ${entry.data.heading}`,
        Content: rendered.Content,
        facts: [
          { label: 'Manual', value: entry.data.heading, href: entry.data.manual },
          { label: 'Source file', value: 'manual/45-troubleshooting.md', href: entry.data.source },
        ],
        swatches: [],
        preview: null,
        command: null,
        body: entry.body ?? '',
      };
    }
    case 'releases': {
      const entry = await getEntry('releases', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: formatDate(entry.data.date),
        Content: rendered.Content,
        facts: [
          { label: 'Published', value: formatDate(entry.data.date) },
          { label: 'GitHub release', value: entry.data.title, href: entry.data.releaseUrl },
          { label: 'ISO', value: entry.data.iso.split('/').pop() ?? entry.data.iso, href: entry.data.iso },
          { label: 'SHA256', value: entry.data.sha256 },
          { label: 'Upgrade', value: entry.data.upgrade },
        ],
        swatches: [],
        preview: null,
        command: null,
        body: entry.body ?? '',
      };
    }
    case 'tools': {
      const entry = await getEntry('tools', id);
      if (!entry) return undefined;
      const rendered = await render(entry);
      return {
        title: entry.data.title,
        description: entry.data.summary,
        meta: `${entry.data.category} · ${entry.data.kind}`,
        Content: rendered.Content,
        facts: [
          { label: 'Plugin id', value: entry.data.pluginId },
          { label: 'Author', value: entry.data.author },
          { label: 'Version', value: entry.data.version },
          { label: 'Repository', value: entry.data.repo.replace('https://github.com/', ''), href: entry.data.repo },
          { label: 'Catalog stars', value: String(entry.data.stars) },
          { label: 'License', value: entry.data.license },
          { label: 'Verification', value: entry.data.verificationStatus },
          { label: 'Catalog generated', value: entry.data.catalogGeneratedAt },
          {
            label: 'Catalog source',
            value: 'omacom/omarchy-plugin-marketplace',
            href: 'https://github.com/omacom/omarchy-plugin-marketplace/blob/975b68ab8fad3792d829e79ae6769c7fd1347721/site/catalog.json',
          },
          { label: 'Added', value: entry.data.addedAt },
          { label: 'Tags', value: entry.data.tags.join(', ') },
        ],
        swatches: [],
        preview: entry.data.preview
          ? {
              src: entry.data.preview,
              alt: `${entry.data.title} preview from the Omarchy plugin marketplace catalog`,
            }
          : null,
        command: entry.data.installCommand,
        body: entry.body ?? '',
      };
    }
  }
}

export type EntryView = NonNullable<Awaited<ReturnType<typeof loadEntry>>>;

export async function searchDocuments() {
  const grouped = await collections();
  const docs: { title: string; summary: string; href: string; section: string; text: string }[] = [];
  for (const section of sectionIds) {
    const cards = await cardsFor(section);
    const byId = new Map(cards.map((card) => [card.href, card]));
    for (const entry of grouped[section]) {
      const href = hrefFor(section, entry.id);
      const card = byId.get(href);
      const body = entry.body ?? '';
      const text = `${card?.title ?? ''} ${card?.summary ?? ''} ${body}`.toLowerCase();
      docs.push({
        title: card?.title ?? entry.id,
        summary: card?.summary ?? '',
        href,
        section: sectionMeta[section].title,
        text,
      });
    }
  }
  return docs;
}
