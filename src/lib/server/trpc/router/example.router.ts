import { publicProcedure, router } from '$lib/trpc/router';
import { z } from 'zod';

export const exampleRouter = router({
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return `Hello ${input.name}!`;
    }),
});
