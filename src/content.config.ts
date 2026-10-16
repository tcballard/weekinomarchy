import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({
  title: z.string(),
  url: z.string().url(),
  published: z.string(),
});

const issues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    sources: z.array(source).min(1),
  }),
});

const themes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/themes' }),
  schema: z.object({
    title: z.string(),
    gallery: z.boolean(),
    order: z.number().int(),
    summary: z.string(),
    mode: z.enum(['dark', 'light']),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    directory: z.string(),
    repo: z.string().url(),
    manual: z.string().url(),
    colors: z.string().url(),
    preview: z.string(),
    release: z.string().url().optional(),
  }),
});

const setups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/setups' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.string().url(),
    description: z.string(),
    license: z.string().nullable(),
    stars: z.number().int(),
    defaultBranch: z.string(),
    pushedAt: z.string(),
    fetchedAt: z.string(),
  }),
});

const fixes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fixes' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    summary: z.string(),
    heading: z.string(),
    manual: z.string().url(),
    source: z.string().url(),
  }),
});

const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    releaseUrl: z.string().url(),
    iso: z.string().url(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    upgrade: z.string(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    summary: z.string(),
    pluginId: z.string(),
    author: z.string(),
    version: z.string(),
    category: z.string(),
    kind: z.string(),
    repo: z.string().url(),
    stars: z.number().int(),
    license: z.string(),
    installCommand: z.string(),
    verificationStatus: z.string(),
    catalogGeneratedAt: z.string(),
    addedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string()),
    preview: z.string().optional(),
  }),
});

export const collections = { issues, themes, setups, fixes, releases, tools };
