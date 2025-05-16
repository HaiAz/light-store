import { Clause, ConditionOperator } from '@/lib/query-builder/parser';

interface ToORMConverter {
  getFilterFieldValue(clause: Clause): unknown;
  getQueryFilters(groupClause: ClauseGroup): unknown
}

type ClauseGroup = {
  condition: ConditionOperator;
  clauses: (Clause | ClauseGroup)[];
}

type RequiredClause = Required<Clause>;

type IncludeOptions<T> = {
  [Key in keyof T]: string[] | Key;
}

export {
  type ToORMConverter,
  type ClauseGroup,
  type RequiredClause,
  type IncludeOptions,
};
