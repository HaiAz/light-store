import { ZodInvalidTypeIssue, ZodIssue } from 'zod';

import { ErrorResponse } from '@/types/common';

const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;
const UNAUTHORIZE_ERROR = 401;

function isZodInvalidTypeIssue(obj: any): obj is ZodInvalidTypeIssue {
  return obj.expected !== undefined && obj.received !== undefined;
}

function errorHasMessage(obj: any): obj is { message: string } {
  return obj.message !== undefined;
}

export class ErrorBase {
  errors: ErrorResponse | undefined;
  code: number | undefined;
}

export class UnauthorizeError extends ErrorBase {
  constructor() {
    super();
    this.errors = {
      errors: 'Unauthorize request',
      code: UNAUTHORIZE_ERROR,
    };
    this.code = UNAUTHORIZE_ERROR;
  }
}

export class SearchQueryBadRequestError extends ErrorBase {
  constructor(message: string) {
    super();
    this.errors = {
      errors: message,
      code: BAD_REQUEST_ERROR_CODE,
    };
    this.code = BAD_REQUEST_ERROR_CODE;
  }
}

export class InternalServerError extends ErrorBase {
  constructor(error: unknown) {
    super();
    this.errors = {
      errors: errorHasMessage(error) ? error.message : `${error}`,
      code: INTERNAL_SERVER_ERROR_CODE,
    };
    this.code = INTERNAL_SERVER_ERROR_CODE;
  }
}

export class NotFoundError extends ErrorBase {
  constructor(message: string) {
    super();
    this.errors = {
      errors: message,
      code: NOT_FOUND_ERROR_CODE,
    };
    this.code = NOT_FOUND_ERROR_CODE;
  }
}

export class BadRequestError extends ErrorBase {
  constructor(errors: ZodIssue[] | string) {
    super();
    if (typeof errors === 'string') {
      this.errors = {
        code: BAD_REQUEST_ERROR_CODE,
        errors: errors,
      };
    } else {
      this.errors = {
        errors: errors.map((error) => {
          if (isZodInvalidTypeIssue(error)) {
            return {
              field: error.path,
              expected: error.expected,
              received: error.received,
              message: error.message,
            };
          }
          return {
            fields: error.path,
            message: error.message,
          };
        }),
        code: BAD_REQUEST_ERROR_CODE,
      };
    }

    this.code = BAD_REQUEST_ERROR_CODE;
  }
}

export class QueryParsingError {
  errors: string;
  
  constructor(errors: string) {
    this.errors = errors;
  }
}
