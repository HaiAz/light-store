import { Prisma } from '@prisma/client';

export const customerCodeRule: Prisma.CodeRuleCreateManyInput = {
  name: 'default code rule',
  type: 'customer',
  description: 'Code rule "${prefix}${delimiter}${autoNumber}"',
  prefix: 'KH',
  active: true,
  delimiter: '-',
  rule: '${prefix}${delimiter}${autoNumber}',
};

export const productCodeRule: Prisma.CodeRuleCreateManyInput = {
  name: 'default code rule',
  type: 'product',
  description: 'Code rule "${prefix}${delimiter}${autoNumber}"',
  prefix: 'SP',
  active: true,
  delimiter: '-',
  rule: '${prefix}${delimiter}${autoNumber}',
};
