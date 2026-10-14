import type { APIRoute } from 'astro';
import { searchDocuments } from '../lib/catalog';

export const GET: APIRoute = async () => {
  const docs = await searchDocuments();
  return new Response(JSON.stringify(docs), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
