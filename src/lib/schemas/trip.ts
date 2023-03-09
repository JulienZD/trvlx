import { z } from 'zod';

export const zCreateTrip = z
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
        path: ['endKm'],
      });
    }

    if (val.startKm > val.endKm) {
      ctx.addIssue({
        code: 'custom',
        message: 'Start km cannot be greater than end km',
        path: ['startKm'],
      });
    }
  });
