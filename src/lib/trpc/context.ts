import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export const createContext = async (event: RequestEvent) => {
  // console.log(event);
  return {
    // context information
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
