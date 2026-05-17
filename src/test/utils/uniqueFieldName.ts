let counter = 0;
export const uniqueFieldName = (prefix: string): string => `${prefix}-${++counter}`;
