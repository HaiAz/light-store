import { PrismaORMQueryBuilder } from './prisma';

import { QueryParsingError } from '@/lib/errors';
import { ConditionOperator, getClauseQueries, IncludeQueryToken, isConditionOperatorType, type Operator, parseIncludeQueries, parseSortQueries } from '@/lib/query-builder/parser';
import { IncludeOptions, ToORMConverter } from '@/lib/query-builder/types';

type SubIncludeToken = { include: IncludeQuery };
type SubSelectToken = { select: IncludeQuery };
type IncludeQuery = Record<string, boolean | SubIncludeToken | SubSelectToken | {}>;

export class QueryBuilder {
  ormConverter: ToORMConverter;
  constructor(ormConverter: ToORMConverter | undefined) {
    if (ormConverter !== undefined) {
      this.ormConverter = ormConverter;
    } else {
      this.ormConverter = new PrismaORMQueryBuilder();
    }
  }

  getQueryFilters<TReturnType>(queryOptions: string): TReturnType | undefined {
    if (!queryOptions) {
      return;
    }
  
    const parsedGroupClauses = getClauseQueries(queryOptions);
    return this.ormConverter.getQueryFilters(parsedGroupClauses) as TReturnType;
  }

  getIncludeQueries<T>(includeQuery: string | string[] | undefined, includeOptions: IncludeOptions<T>): T | undefined {
    if (!includeQuery) {
      return;
    }
  
    const parsedQueries = parseIncludeQueries(includeQuery);
    let includeQueries: IncludeQuery = {};
  
    parsedQueries.forEach(query => {
      const includeField = includeOptions[query.field as keyof T];

      if (!includeField) {
        throw new QueryParsingError(`Include field ${query.field} is not supported.`);
      }

      const queries = this._getIncludeQuery(query);
      includeQueries = { ...includeQueries, ...queries };
    });

    return includeQueries as T;
  }

  getSortQueries<TReturnType>(sortQuery: string): TReturnType[] | undefined {
    if (!sortQuery) {
      return;
    }

    const parsedQueries = parseSortQueries(sortQuery);

    if (!parsedQueries) {
      return;
    }

    return parsedQueries as TReturnType[];
  }

  _getIncludeQuery(token: IncludeQueryToken) {
    const includeQueries: IncludeQuery = {};
    if (!token.children) {
      includeQueries[token.field] = true;
    } else {
      token.children.forEach(subToken => {
        let includes: SubIncludeToken | SubSelectToken;
        if (subToken.isInclude) {
          includes = includeQueries[token.field] as SubIncludeToken;
          if (!includeQueries[token.field]) {
            includeQueries[token.field] = { include: {} };
            includes = includeQueries[token.field] as SubIncludeToken;
          }
        } else {
          includes = includeQueries[token.field] as SubSelectToken;
          if (!includeQueries[token.field]) {
            includeQueries[token.field] = { select: {} };
            includes = includeQueries[token.field] as SubSelectToken;
          }
        }
        
        if ('include' in includes) {
          includes.include = { ...includes.include, ...this._getIncludeQuery(subToken) };
        }
        else {
          includes.select = { ...includes.select, ...this._getIncludeQuery(subToken) };
        }
        
      });
    }

    return includeQueries;
  }

  getQueryString<TModel>(
    fieldValue: string, fieldName: keyof TModel, operator: Operator, isExcluded: boolean = false
  ) {
    if (isConditionOperatorType(operator)) {
      return `${operator}`;
    }
    return `${isExcluded ? '-' : ''}${fieldName as string}${operator}"${fieldValue}"`;
  }

  joinQueries(...args: (string | ConditionOperator)[]) {
    return args.join(' ');
  }
}
