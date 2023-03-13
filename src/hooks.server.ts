import { auth } from '$lib/server/auth/auth';
import { appRouter } from '$lib/server/trpc/router/_app';
import { createContext } from '$lib/trpc/context';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = sequence(auth, createTRPCHandle({ router: appRouter, createContext })) satisfies Handle;
