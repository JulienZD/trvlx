import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { prisma } from '$lib/server/db/client';

export const createContext = async (event: RequestEvent) => {
  return {
    prisma,
    session: await event.locals.getSession(),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
