import { z } from 'zod';

const supportedPageSizes = [ 10, 20, 50, 100 ];
const defaultPageSize = 10;

const paginationBaseSchema = {
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(defaultPageSize).max(100).default(defaultPageSize),
};

const paginationSchema = z.object(paginationBaseSchema);

type Pagination = PaginationQuery & {
  skip: number;
  getTotalPages: (totalCount: number) => number;
};

function getPaginationQueries(queries: { page: number, limit: number}): PaginationQuery {
  const { page, limit } = queries;

  return { page, limit };
}

// TODO: check pagination start from page 1
function getPagination(query: PaginationQuery): Pagination {
  return {
    page: query.page,
    limit: query.limit,
    skip: query.page * query.limit,
    getTotalPages: (totalCount: number): number => {
      return totalCount === 0
        ? 0
        : totalCount < query.limit
          ? 1
          : Math.ceil(totalCount / query.limit);
    },
  };
}

type PaginationQuery = z.infer<typeof paginationSchema>;

export {
  type PaginationQuery,
  getPagination,
  getPaginationQueries,
  paginationSchema,
  supportedPageSizes,
  defaultPageSize,
  paginationBaseSchema,
};
