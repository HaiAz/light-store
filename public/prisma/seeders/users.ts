import { Prisma } from '@prisma/client';

import { hash } from '../../src/lib/crypto';

export const adminUser: Prisma.UserCreateInput = {
  firstName: 'Admin',
  lastName: 'POS',
  email: 'pos-admin@kyberosc.com',
  role: 'admin',
  password: hash(process.env.DEFAULT_ADMIN_PASSWORD as string),
};
