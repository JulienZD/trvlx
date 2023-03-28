import { zCreateTrip, type TripCsv } from '$lib/schemas/trip';
import { protectedProcedure, router } from '$lib/trpc/router';
import { modeOrAverage } from '$lib/util/math';
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
    const latestTrips = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    const [latestWithHighestStartKm] = latestTrips.sort((a, b) => {
      if (a.date.getTime() === b.date.getTime()) {
        return b.startKm - a.startKm;
      }
      return a.date.getTime() > b.date.getTime() ? -1 : 1;
    });

    return latestWithHighestStartKm ?? null;
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
      return a.date.getTime() > b.date.getTime() ? -1 : 1;
    });
  }),
  import: protectedProcedure.input(zCreateTrip.array()).mutation(async ({ ctx, input }) => {
    const trips = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const tripsToCreate = input.filter((trip) => {
      return !trips.some((t) => t.date.getTime() === new Date(trip.date).getTime());
    });

    return ctx.prisma.trip.createMany({
      data: tripsToCreate
        .map((trip) => ({
          ...trip,
          userId: ctx.session.user.id,
        }))
        .sort((a, b) => a.startKm - b.startKm),
    });
  }),
  export: protectedProcedure.mutation(async ({ ctx }) => {
    const trips = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return trips
      .map(
        (trip): TripCsv => ({
          date: trip.date.toISOString().split('T')[0] as string,
          start: trip.startKm,
          end: trip.endKm,
          private: trip.isPrivate,
        })
      )
      .sort((a, b) => {
        // sort by date asc, then start asc
        if (a.date === b.date) {
          return a.start - b.start;
        }

        return a.date.localeCompare(b.date);
      });
  }),
  modeOrAvgDistance: protectedProcedure.query(async ({ ctx }) => {
    const trips = await ctx.prisma.trip.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    const distances = trips.map((trip) => trip.endKm - trip.startKm);

    return modeOrAverage(distances);
  }),
});
