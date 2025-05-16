import { z } from 'zod';

import type { HandlerArgs } from '@/lib/api';
import { createHandlers } from '@/lib/api';
import { QueryOptionsSchema, queryOptionsSchema } from '@/schemas/common';
import {
  passwordSchema,
  userEditFormSchema,
  UserForm,
  UserWithoutPassword,
  userWithoutPasswordSchema,
} from '@/schemas/user';
import * as userService from '@/services/users';
import { ResponseBody } from '@/types/common';
import { WithRequiredProperty } from '@/types/util';

async function createOrUpdateUser({ routeRequest }: HandlerArgs) {
  const newUser = routeRequest.payload as UserForm;

  if (newUser.id) {
    return await userService.updateUser(newUser as WithRequiredProperty<UserForm, 'id'>);
  }
  
  return await userService.createUser(newUser);
}

async function getUsers({ routeRequest }: HandlerArgs) {
  const queryOptions = routeRequest.queries as QueryOptionsSchema;
  const results = await userService.getUsers(queryOptions);
  const parsedUsers = z.array(userWithoutPasswordSchema).parse(results.users);

  const response: ResponseBody<UserWithoutPassword[]> = {
    data: parsedUsers,
    pagination: {
      pageCount: results.pageCount,
      currentPage: results.currentPage,
      totalItems: results.totalItems,
      limit: results.pageSize,
    },
  };

  return response;
}

module.exports = createHandlers([
  {
    method: 'POST',
    handler: createOrUpdateUser,
    config: {
      payloadSchema: userEditFormSchema.superRefine((values, ctx) => {
        const { password, id } = values;

        if (password) {
          const parsedPassword = passwordSchema.safeParse(password);

          if (!parsedPassword.success) {
            parsedPassword.error.issues.forEach((issue) => {
              ctx.addIssue(issue);
            });
          }
        } else if(!id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password required',
            path: [ 'password' ],
          });
        }
        return z.NEVER;
      }),
      auth: true,
    },
  },
  {
    method: 'GET',
    handler: getUsers,
    config: {
      querySchema: queryOptionsSchema,
      auth: true,
    },
  },
]);
