import { ZodParsedType } from 'zod';

type Props = {
  children?: React.ReactNode;
};

type ResponseWithPagination<T> = {
  data: T;
  pagination?: PaginationResponse;
};

type ErrorType = {
  field?: (string | number)[];
  message?: string;
  expected?: ZodParsedType;
  received?: ZodParsedType;
};

type ErrorResponse = {
  errors: ErrorType[] | string;
  code: string | number;
};

type ResponseBody<T> =
  | (T extends object ? T : never)
  | ([] extends T ? ResponseWithPagination<T> : never)
  | ErrorResponse;

type PaginationResponse = {
  totalItems: number;
  pageCount: number;
  currentPage: number;
  limit: number;
};

type QueryPrimitive = string | number | Date;

export type {
  Props,
  ResponseBody,
  PaginationResponse,
  ResponseWithPagination,
  ErrorResponse,
  QueryPrimitive,
};
