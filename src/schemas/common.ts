import { z, ZodSchema } from 'zod';

import { paginationBaseSchema } from './pagination';

import { PERIOD_TIME } from '@/configs/configs';

export const INCLUDE_QUERY_OPTION = 'op[include]';
export const MAX_FILE_SIZE = 500000;
export const ACCEPTED_IMAGE_TYPES = [ 'image/jpeg', 'image/jpg', 'image/png' ];

const NUMBER_ONLY_REGEX = /[^\d.-]/g;

export const baseEntitySchema = {
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
};

export const searchQuerySchema = z.object({
  q: z.string(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const searchQueryOptionsSchema = z.object({
  q: z.string(),
}).extend(paginationBaseSchema);

export type SearchQueryOptionsSchema = z.infer<typeof searchQueryOptionsSchema>;

export const byIdSchema = z.object({
  id: z.string(),
});

export type IdQuerySchema = z.infer<typeof byIdSchema>;

export const includeQueryOptionSchema = z.object({
  [INCLUDE_QUERY_OPTION]: z.union([ z.string(), z.array(z.string()) ]).optional(),
});

export type IncludeQueryOption = z.infer<typeof includeQueryOptionSchema>;

export const queryOptionsSchema = z.object({
  [INCLUDE_QUERY_OPTION]: z.union([ z.string(), z.array(z.string()) ]).optional(),
  q: z.string().optional(),
  sort: z.string().optional(),
}).extend(paginationBaseSchema);

export type QueryOptionsSchema = z.infer<typeof queryOptionsSchema>;

export const searchQueryOptionSchema = queryOptionsSchema.extend({
  q: z.string(),
});

export type SearchQueryOptionQuery = z.infer<typeof searchQueryOptionSchema>;
export type CustomerStats = {
  sumTotalDebts: number | null,
  sumTotalOrders: number | null,
}
export const byPeriodTimeSchema = z.object({
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  periodTime: z.enum(PERIOD_TIME).optional(),
});

export type PeriodTimeQuerySchema = z.infer<typeof byPeriodTimeSchema>;

// TODO: handling i18n parsing
export function numberPreprocessing(schema: ZodSchema) {
  return z.preprocess(val => {
    const stringValue = String(val);
    return stringValue.replace(NUMBER_ONLY_REGEX, '');
  }, schema);
}

export const emptyStringToUndefined = z.literal('').transform(() => undefined);
