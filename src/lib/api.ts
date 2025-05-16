import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { DefaultSession, DefaultUser, Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { SafeParseReturnType, Schema, z, ZodSchema } from 'zod';

import { convertFormDataToObj } from './common';

import { BadRequestError, ErrorBase, InternalServerError, QueryParsingError as QueryBuildingParsingError, UnauthorizeError } from '@/lib/errors';
import { authOptions } from '@/services/auth';
import { ResponseBody } from '@/types/common';
import { NonEmptyArray, NonEmptyObject } from '@/types/util';

type ApiMethods = 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'OPTIONS';

type ApiHandlers = {
  [K in ApiMethods]?: ApiHandler;
};

type ApiHandler = (req: NextRequest, ...args: any) => Promise<NextResponse>;

type SessionArgs = {
  auth: true;
  session: Session;
};

type HandlerArgs = {
  nextRequest: NextRequest;
  routeRequest: RouteRequest;
  args: any[];
  params: unknown;
} & (SessionArgs | {
  auth: false;
});

type RouteHandler = (args: HandlerArgs) => Promise<ResponseBody<unknown> | unknown>;

type RouteHandlerConfigs = {
  method: ApiMethods;
  handler: RouteHandler;
  config: RouteConfig;
};

type RouteConfig = {
  paramsSchema?: Schema;
  payloadSchema?: Schema;
  querySchema?: Schema;
  isFormData?: boolean;
  auth: boolean;
};

type RouteRequest = {
  payload?: any;
  params?: any;
  queries?: any;
};

declare module 'next-auth' {
  // Adding the new field to the User interface
    interface User extends DefaultUser {
      id: string;
    }
  
  // Here I add the user object to the session object so I can access it easily.
    interface Session extends DefaultSession {
      user: User;
    }
  }

const apiErrorMap: z.ZodErrorMap = (error, ctx) => {
  // TODO: maybe other types also need to have custom error message?
  switch (error.code) {
  case z.ZodIssueCode.invalid_type:
    return {
      message: `Expected ${error.expected} but received ${error.received}.`,
    };
  }

  // fall back to default message!
  return { message: ctx.defaultError };
};

async function getRouteInputs({
  config,
  req,
  params,
}: {
  config: RouteConfig;
  req: NextRequest;
  params: unknown;
}): Promise<RouteRequest> {
  const paramsValidationResult = safeParseInput(config.paramsSchema, params);

  // Validate queries
  const queriesValidationResult = safeParseInput(
    config.querySchema,
    config.querySchema
      ? parseQueryString(req.url)
      : null,
  );

  // Validate payload
  let payload: unknown = null;
  
  if (config.payloadSchema && config.isFormData) {
    const formData = await req.formData();
    payload = convertFormDataToObj(formData);
  } else if (config.payloadSchema) {
    payload = await req.json();
  }
  const bodyValidationResult = safeParseInput(config.payloadSchema, payload);

  const errors = getRequestValidationErrors({
    paramsValidationResult,
    bodyValidationResult,
    queriesValidationResult,
  });

  if (errors && errors.length) {
    throw new BadRequestError(errors);
  }

  return {
    payload: bodyValidationResult?.success
      ? bodyValidationResult.data
      : undefined,
    params: paramsValidationResult?.success
      ? paramsValidationResult.data
      : undefined,
    queries: queriesValidationResult?.success
      ? queriesValidationResult.data
      : undefined,
  };
}

function safeParseInput(schema: ZodSchema | undefined, input: unknown) {
  if (!schema) {
    return undefined;
  }

  return schema.safeParse(input, {
    errorMap: apiErrorMap,
  });
}

function getRequestValidationErrors({
  paramsValidationResult,
  bodyValidationResult,
  queriesValidationResult,
}: {
  paramsValidationResult: SafeParseReturnType<unknown, unknown> | undefined;
  bodyValidationResult: SafeParseReturnType<unknown, unknown> | undefined;
  queriesValidationResult: SafeParseReturnType<unknown, unknown> | undefined;
}) {
  const errors = [];
  if (paramsValidationResult && !paramsValidationResult.success) {
    const error = paramsValidationResult.error;
    errors.push(...error.issues);
  }

  if (bodyValidationResult && !bodyValidationResult.success) {
    const error = bodyValidationResult.error;
    errors.push(...error.issues);
  }

  if (queriesValidationResult && !queriesValidationResult.success) {
    const error = queriesValidationResult.error;
    errors.push(...error.issues);
  }

  return errors.length ? errors : undefined;
}

function errorHandler({ error: error }: { error: ErrorBase }) {
  return NextResponse.json({ ...error.errors }, { status: error.code });
}

function createHandlers(
  wrapped: NonEmptyArray<RouteHandlerConfigs>,
): NonEmptyObject<ApiHandlers> {
  const wrappedHandlers: ApiHandlers = {};
  wrapped.forEach((apiHandler) => {
    wrappedHandlers[apiHandler.method] = async (
      req: NextRequest,
      { params }: { params: unknown },
      ...args: any
    ): Promise<NextResponse<unknown>> => {
      try {
        let session: Session | null = null;
        if (apiHandler.config.auth) {
          session = await getServerSession(authOptions);
          if (!session || !session.user || !session.user.id) {
            return errorHandler({ error: new UnauthorizeError() });
          }
        }

        // Unpacking request
        const routeRequest = await getRouteInputs({
          config: apiHandler.config,
          req,
          params,
        });

        let responseBody = null;

        if (session) {
          responseBody = await apiHandler.handler(
            {
              nextRequest: req,
              routeRequest: routeRequest,
              args: [ ...args ],
              auth: true,
              session,
              params,
            }
          );
        } else {
          responseBody = await apiHandler.handler(
            {
              nextRequest: req,
              routeRequest: routeRequest,
              args: [ ...args ],
              auth: false,
              params,
            }
          );
        }
        // TODO: handle empty response properly
        return responseBody ? NextResponse.json(responseBody) : NextResponse.json(null);
      } catch (err: any) {
        if (err instanceof ErrorBase) {
          return errorHandler({ error: err });
        }
        if (err instanceof QueryBuildingParsingError) {
          return errorHandler({ error: new BadRequestError(err.errors) });
        }

        // Handling Prisma DB error
        // https://www.prisma.io/docs/reference/api-reference/error-reference
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code.startsWith('P20')) {
          return errorHandler({ error: new BadRequestError(err.message) });
        }
        
        // global error handler
        console.error(`Unhandled error: ${err}`);
        return errorHandler({ error: new InternalServerError(err) });
      }
    };
  });

  return wrappedHandlers as NonEmptyObject<ApiHandlers>;
}

function parseQueryString(url: string): Record<string, string | string[]> | undefined {
  const entries = (new URL(url).searchParams.entries());
  const entryArray = Array.from(entries);

  if (!entryArray || !entryArray.length) {
    return;
  }

  const results: Record<string, string | string[]> = {};

  entryArray.forEach((current) => {
    const key = current[0];
    const result = results[key];
    if (!result) {
      results[key] = current[1];
    } else if (Array.isArray(result)){
      result.push(current[1]);
    } else {
      results[key] = [ result, current[1] ];
    }
  });

  return results;
}

export { createHandlers, type RouteRequest, type HandlerArgs, type SessionArgs };
