import { createHandlers, HandlerArgs } from '@/lib/api';
import { NotFoundError } from '@/lib/errors';
import { prisma as prismadb } from '@/lib/prisma';
import { byIdSchema, IdQuerySchema } from '@/schemas/common';
import { userWithoutPasswordSchema } from '@/schemas/user';

async function getUserById({ routeRequest }: HandlerArgs) {
  const query = routeRequest.params as IdQuerySchema;

  const user = await prismadb.user.findUnique({
    where: {
      id: query.id,
    },
  });

  if (!user) {
    throw new NotFoundError(`User with Id ${query.id} does not exist.`);
  }

  const parsedUsers = userWithoutPasswordSchema.parse(user);
  return parsedUsers;
}

module.exports = createHandlers([
  {
    method: 'GET',
    handler: getUserById,
    config: {
      paramsSchema: byIdSchema,
      auth: true,
    },
  },
]);
