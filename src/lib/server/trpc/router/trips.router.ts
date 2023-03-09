import { zCreateTrip } from '$lib/schemas/trip';
import { protectedProcedure, router } from '$lib/trpc/router';

export const tripsRouter = router({
  create: protectedProcedure.input(zCreateTrip).mutation(({ ctx, input }) => {
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
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }),
});
