import { zCreateTrip } from '$lib/schemas/trip';
import { protectedProcedure, router } from '$lib/trpc/router';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const tripsRouter = router({
  create: protectedProcedure.input(zCreateTrip).mutation(({ ctx, input }) => {
    return ctx.prisma.trip.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const trip = await ctx.prisma.trip.findFirst({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });

    if (!trip) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return ctx.prisma.trip.delete({ where: { id: input.id } });
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
  all: protectedProcedure.query(async ({ ctx }) => {
    const allTrips = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // sort by date desc, then startKm desc
    return allTrips.sort((a, b) => {
      if (a.date.getTime() === b.date.getTime()) {
        return b.startKm - a.startKm;
      }
      return a.date.getTime() > b.date.getTime() ? 1 : -1;
    });
  }),
});
