import type { CreateBaseMutationResult } from '@tanstack/svelte-query';
import type { z } from 'zod';

export const extractFormErrors = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMutation extends TRPCMutationWithZodError<any>,
  TFormErrors extends Record<string, unknown>
>(
  mutation: TMutation,
  formErrors: TFormErrors = {} as TFormErrors
): Partial<Record<ErrorKey<TFormErrors, TMutation>, ErrorValue>> => {
  if (!mutation.isError || !mutation.error) {
    return {};
  }

  const errors = mutation?.error?.data?.zodError?.fieldErrors;

  return {
    ...formErrors,
    ...errors,
  } as Partial<Record<ErrorKey<TFormErrors, TMutation>, ErrorValue>>;
};

type ErrorKey<TFormErrors extends Record<string, unknown>, TMutation extends TRPCMutationWithZodError<any>> =
  | keyof NonNullable<TMutation['variables']>
  | keyof TFormErrors;

type ErrorValue = string | string[] | null | undefined;

export type TRPCMutationWithZodError<TVariables> = CreateBaseMutationResult<
  unknown,
  { data?: { zodError?: z.typeToFlattenedError<Record<string, unknown>> | null } | null },
  TVariables,
  unknown
>;
