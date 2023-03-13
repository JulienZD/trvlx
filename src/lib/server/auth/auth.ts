import { DISCORD_ID, DISCORD_SECRET, PREVIEW_SIGNIN_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/db/client';
import type { Adapter } from '@auth/core/adapters';
import { decode, encode, type JWT } from '@auth/core/jwt';
import CredentialsProvider from '@auth/core/providers/credentials';
import DiscordProvider from '@auth/core/providers/discord';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { isDevelopment, isPreview, isProduction } from '../env';
import { randomUUID } from 'crypto';

const SESSION_COOKIE = '__Secure-next-auth.session-token';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const addTimeToDate = (time: number, date: Date) => {
  return new Date(date.getTime() + time * 1000);
};

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

const developmentAndPreviewProviders = [
  CredentialsProvider({
    credentials: {
      username: {
        label: 'Username',
        type: 'text',
        placeholder: 'johndoe',
      },
      email: {
        label: 'Email',
        type: 'email',
        placeholder: 'johndoe@example.com',
      },
      ...(isDevelopment ? {} : { password: { label: 'Password', type: 'password' } }),
    },
    authorize: async (credentials) => {
      if (!credentials) return null;

      if (isPreview && credentials.password !== PREVIEW_SIGNIN_SECRET) {
        return null;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          email: credentials.email,
        },
      });

      if (existingUser) {
        return existingUser;
      }

      const newUser = await prisma.user.create({
        data: {
          email: credentials.email,
          emailVerified: new Date(),
          name: credentials.username,
        },
      });

      return newUser;
    },
  }),
];

const productionProviders = [
  // @ts-expect-error Typing seems to be incorrect
  DiscordProvider({
    clientId: DISCORD_ID,
    clientSecret: DISCORD_SECRET,
  }),
];

const isCredentialsCallback = (event: RequestEvent) => {
  return event.request.method === 'POST' && event.url.pathname === '/auth/callback/credentials';
};

export const auth: Handle = (request) => {
  const { event } = request;
  const authHandler = SvelteKitAuth({
    providers: isProduction ? productionProviders : developmentAndPreviewProviders,
    adapter,
    jwt: {
      encode: ({ token, secret, maxAge }) => {
        if (isProduction || !isCredentialsCallback(event)) {
          return encode({ token, secret, maxAge });
        }

        const cookie = event.cookies.get(SESSION_COOKIE);

        return cookie || '';
      },
      decode: async ({ token, secret }) => {
        if (!isProduction && isCredentialsCallback(event)) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
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
      signIn: async ({ user }) => {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (isProduction || !isCredentialsCallback(event) || !user) {
          return true;
        }

        const sessionToken = randomUUID();
        const sessionMaxAge = THIRTY_DAYS;
        const sessionExpiry = addTimeToDate(sessionMaxAge, new Date());

        await adapter.createSession({
          sessionToken: sessionToken,
          userId: user.id,
          expires: sessionExpiry,
        });

        event.cookies.set(SESSION_COOKIE, sessionToken, {
          expires: sessionExpiry,
        });

        return true;
      },
    },
  });

  return authHandler(request);
};
