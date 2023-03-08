import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load = (async (event) => {
  const { queryClient } = await event.parent();
  const client = trpc(event, queryClient);

  return {
    foo: client.example.greeting.createServerQuery({ name: 'Julien' }),
    queries: client.createServerQueries((t) => ['hi', 'hello'].map((name) => t.example.greeting({ name }))),
  };
}) satisfies PageLoad;
