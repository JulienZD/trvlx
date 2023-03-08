import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import type { QueryClient } from '@tanstack/svelte-query';
import type { AppRouter } from '$lib/server/trpc/router/_app';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import superjson from 'superjson';

let browserClient: ReturnType<typeof svelteQueryWrapper<AppRouter>>;

export const trpc = (init?: TRPCClientInit, queryClient?: QueryClient) => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && browserClient) {
    return browserClient;
  }

  const client = svelteQueryWrapper<AppRouter>({
    client: createTRPCClient<AppRouter>({ init, transformer: superjson }),
    queryClient,
  });

  if (isBrowser) {
    browserClient = client;
  }

  return client;
};
