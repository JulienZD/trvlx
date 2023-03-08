import { protectedProcedure, router } from '$lib/trpc/router';
import { z } from 'zod';

export const tripsRouter = router({
  create: protectedProcedure
    .input(
      z
        .object({
          date: z
            .string()
            .refine((value) => !isNaN(new Date(value).getTime()), {
              message: 'Invalid date',
            })
            .default(() => new Date().toISOString())
            .transform((v) => new Date(v).toISOString()),
          startKm: z.preprocess(Number, z.number().min(0).default(0)),
          endKm: z.preprocess(Number, z.number().min(0).default(0)),
          isPrivate: z.preprocess(Boolean, z.boolean().default(false)),
        })
        .superRefine((val, ctx) => {
          if (val.startKm === 0 && val.endKm === 0) {
            ctx.addIssue({
              code: 'custom',
              message: 'Both start and end km cannot be 0',
              path: ['startKm', 'endKm'],
            });
          }

          if (val.startKm > val.endKm) {
            ctx.addIssue({
              code: 'custom',
              message: 'Start km cannot be greater than end km',
              path: ['startKm', 'endKm'],
            });
          }
        })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.trip.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  mostRecent: protectedProcedure.query(async ({ ctx }) => {
    const [latest] = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 1,
    });

    return latest ?? null;
  }),
});
