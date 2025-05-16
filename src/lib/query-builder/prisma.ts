import { QueryParsingError } from '@/lib/errors';
import { Clause } from '@/lib/query-builder/parser';
import { ClauseGroup, RequiredClause, ToORMConverter } from '@/lib/query-builder/types';
import { AtLeastOne, isType } from '@/types/util';

const PRISMA_FILTER_OPERATORS = [ 'contains', 'gt', 'gte', 'lt', 'lte', 'mode' ] as const;

type PrismaOperator = (typeof PRISMA_FILTER_OPERATORS)[number]
type PrismaPrimitiveType = string | number | boolean | undefined;
type PrismaFilterOperators = {
  [K in PrismaOperator]: PrismaPrimitiveType
};

type PrismaFieldFilterReturnType = PrismaPrimitiveType | {
  not: PrismaPrimitiveType | {
    contains: PrismaPrimitiveType,
    mode?: 'insensitive',
  };
} | AtLeastOne<PrismaFilterOperators>;

type PrismaFieldQueryType = Record<string, PrismaFieldFilterReturnType>;
type PrismaQueryReturnType = Record<string, (PrismaFieldQueryType | PrismaQueryReturnType)[]>;

export class PrismaORMQueryBuilder implements ToORMConverter {
  getFilterFieldValue(clause: Clause): PrismaFieldFilterReturnType {
    switch (clause.operator) {
    case ':':
      return !clause.isExcluded ? clause.value : { not: clause.value };
    case '~':
      return !clause.isExcluded ? { contains: clause.value, mode: 'insensitive' } : { not: { contains: clause.value, mode: 'insensitive' } };
    case '>':
      return !clause.isExcluded ? { gt: clause.value } : { lte: clause.value };
    case '<':
      return !clause.isExcluded ? { lt: clause.value } : { gte: clause.value };
    case '>=':
      return !clause.isExcluded ? { gte: clause.value } : { lt: clause.value };
    case '<=':
      return !clause.isExcluded ? { lte: clause.value } : { gt: clause.value };
    default:
      throw new QueryParsingError(`Filter operator ${clause.operator} is not supported`);
    }
  }

  getQueryFilters(groupClause: ClauseGroup): PrismaQueryReturnType {
    const group: (PrismaFieldQueryType | PrismaQueryReturnType)[] = [];
    const queryObj: PrismaQueryReturnType = {
      [groupClause.condition.toUpperCase()]: group,
    };
  
    groupClause.clauses.forEach(clause => {
      if (isType<Clause>(clause, 'clause')) {
        const fieldClause = clause as RequiredClause;
        const field: Record<string, PrismaFieldFilterReturnType> = {
          [fieldClause.field]: this.getFilterFieldValue(fieldClause),
        };
        group.push(field);
      } else {
        group.push(this.getQueryFilters(clause));
      }
    });
  
    return queryObj;
  }
}
