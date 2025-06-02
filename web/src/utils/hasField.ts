export const hasField = <T extends string, O>(obj: unknown, key: T): obj is Record<T, O> => {
  return typeof obj === 'object' && obj !== null && key in obj;
};
