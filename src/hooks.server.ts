import { DISCORD_ID, DISCORD_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/db/client';
import { appRouter } from '$lib/server/trpc/router/_app';
import { createContext } from '$lib/trpc/context';
import type { Adapter } from '@auth/core/adapters';
import DiscordProvider from '@auth/core/providers/discord';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

const prismaAdapter = PrismaAdapter(prisma);

const adapter = {
  ...prismaAdapter,
  linkAccount({ expires_in, ...account }) {
    return prismaAdapter.linkAccount({
      ...account,
      expires_at: expires_in ? Math.floor(Date.now() / 1000) + expires_in : null,
    });
  },
} satisfies Adapter;

export const handle = sequence(
  SvelteKitAuth({
    providers: [
      // @ts-expect-error Typing seems to be incorrect
      DiscordProvider({
        clientId: DISCORD_ID,
        clientSecret: DISCORD_SECRET,
      }),
    ],
    adapter,
    callbacks: {
      session({ session, user }) {
        if (user) {
          session.user = {
            name: user.name as string,
            email: user.email,
            id: user.id,
            image: user.image,
          };
        }

        return session;
      },
    },
  }),
  createTRPCHandle({ router: appRouter, createContext })
) satisfies Handle;
