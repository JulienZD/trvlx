import type { Context } from '$lib/trpc/context';
import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 👈 simulate an expensive operation
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  }),
});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
