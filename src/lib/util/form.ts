export const extractFormErrors = (
  mutation: {
    isError: boolean;
    error: {
      data: {
        zodError: {
          fieldErrors: Record<string, unknown>;
          formErrors: Record<string, unknown>;
        };
      };
    } | null;
  },
  formErrors: Record<string, unknown> = {}
) => {
  if (!mutation.isError || !mutation.error) {
    return {};
  }

  const errors = mutation?.error?.data?.zodError?.fieldErrors;

  return {
    ...formErrors,
    ...errors,
  };
};
