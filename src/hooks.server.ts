import { appRouter } from '$lib/server/trpc/router/_app';
import { createContext } from '$lib/trpc/context';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { SvelteKitAuth } from '@auth/sveltekit';
import DiscordProvider from '@auth/core/providers/discord';
import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
  SvelteKitAuth({
    providers: [
      // @ts-expect-error Typing seems to be incorrect
      DiscordProvider({
        clientId: DISCORD_ID,
        clientSecret: DISCORD_SECRET,
      }),
    ],
  }),
  createTRPCHandle({ router: appRouter, createContext })
) satisfies Handle;
