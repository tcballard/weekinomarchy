import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const issues = await getCollection('issues');
  const items = issues
    .slice()
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((issue) => ({
      title: issue.data.title,
      pubDate: issue.data.date,
      description: issue.data.summary,
      link: `/issues/${issue.id}/`,
    }));

  return rss({
    title: 'Week in Omarchy',
    description: 'Issues of Week in Omarchy.',
    site: context.site ?? 'https://weekinomarchy.com',
    items,
    customData: '<language>en-us</language>',
  });
}
