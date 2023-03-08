import { router } from '$lib/trpc/router';
import { exampleRouter } from './example.router';

export const appRouter = router({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
