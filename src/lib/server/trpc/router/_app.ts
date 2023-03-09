import { router } from '$lib/trpc/router';
import { exampleRouter } from './example.router';
import { tripsRouter } from './trips.router';

export const appRouter = router({
  example: exampleRouter,
  trips: tripsRouter,
});

export type AppRouter = typeof appRouter;
