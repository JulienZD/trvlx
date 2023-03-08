import type { Context } from './context';
import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '$lib/server/trpc/router/_app';

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
