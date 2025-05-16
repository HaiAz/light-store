import { PrismaORMQueryBuilder } from '@/lib/query-builder/prisma';
import { QueryBuilder } from '@/lib/query-builder/query-builder';

// TODO: proper wrapping builder to a service instead of using QueryBuilder directly
export const queryBuilder = new QueryBuilder(new PrismaORMQueryBuilder());
