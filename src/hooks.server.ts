import { appRouter } from '$lib/server/trpc/router/_app';
import { createContext } from '$lib/trpc/context';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router: appRouter, createContext });
