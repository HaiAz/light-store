
import { prisma as prismadb } from '@/lib/prisma';
import { QueryOptionsSchema } from '@/schemas/common';
import { getPagination } from '@/schemas/pagination';
import { UserEditForm, UserForm, userWithoutPasswordSchema } from '@/schemas/user';
import { hashPassword } from '@/services/auth';
import { WithRequiredProperty } from '@/types/util';

export async function createUser(newUser: UserForm) {
  const savedUser = await prismadb.user.create({
    data: {
      ...newUser,
      password: hashPassword(newUser.password),
    },
  });

  const parsedUser = userWithoutPasswordSchema.parse(savedUser);
  return parsedUser;
}

export async function updateUser(user: WithRequiredProperty<UserEditForm, 'id'>) {
  const savedUser = await prismadb.user.update({
    where: { id: user.id },
    data: user,
  });

  const parsedUser = userWithoutPasswordSchema.parse(savedUser);
  return parsedUser;
}

export async function getUsers(queryOptions: QueryOptionsSchema) {
  const paginationSettings = getPagination({
    page: queryOptions.page,
    limit: queryOptions.limit,
  });
  
  const [ users, totalItems ] = await prismadb.$transaction([
    prismadb.user.findMany({
      skip: paginationSettings.skip,
      take: paginationSettings.limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prismadb.user.count(),
  ]);

  return {
    users: users,
    pageCount: paginationSettings.getTotalPages(totalItems),
    currentPage: queryOptions.page,
    totalItems: totalItems,
    pageSize: paginationSettings.limit,
  };
}
