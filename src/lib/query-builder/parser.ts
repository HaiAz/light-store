
import { QueryParsingError, SearchQueryBadRequestError } from '@/lib/errors';
import { isType } from '@/types/util';

const CLAUSE_SPLITTER = /^(?<isExcluded>-*)(?<field>\w*)(?<operator>(>=|:|~|>=|>|<|<=))"?(?<value>.*?)"?$/;
const TOKEN_SPLITTER = /(\S+:'(?:[^'\\]|\\.)*')|(\S+:"(?:[^"\\]|\\.)*")|(-?"(?:[^"\\]|\\.)*")|(-?'(?:[^'\\]|\\.)*')|(\S+~"(?:[^"\\]|\\.)*")|\S+|\S+:\S+/g;
const INCLUDE_SPLITTER = /([\[\]])/;
const OPERATORS = [ ':', '~', '>', '<', '>=', '<=' ] as const;
const CONDITIONS = [ 'or', 'and' ] as const;
const SURROUNDING_QUOTES_REGEX = /^\"|\"$/g;
const SORT_ORDERS = [ 'desc', 'asc' ];

export type ConditionOperator = (typeof CONDITIONS)[number];
export type Operator = (typeof OPERATORS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export type SortQuery = Record<string, SortOrder>;

export type IncludeQueryToken = {
  field: string;
  children?: IncludeQueryToken[];
  isInclude: boolean;
  depth: number;
};

type ClauseGroup = {
  condition: ConditionOperator;
  clauses: (Clause | ClauseGroup)[];
};

export type Clause = {
  clause: string;
  field?: string;
  value?: string;
  isExcluded?: boolean;
  isCondition?: boolean;
  operator: Operator | ConditionOperator;
  offset?: {
    start: number;
    end: number;
  };
};

export function parseSortQueries(queries: string): SortQuery[] | undefined {
  const sortQueries = queries.split(',');

  if (!sortQueries || !sortQueries.length) {
    return;
  }
  const parsedQueries: SortQuery[] = [];
  sortQueries.forEach((query) => {
    const isDescending = query.startsWith('-');
    const fieldName = isDescending ? query.substring(1) : query;
    parsedQueries.push({
      [fieldName]: isDescending ? 'desc' : 'asc',
    });
  });

  return parsedQueries;
}

export function parseIncludeQueries(queries: string | string[]): IncludeQueryToken[] {
  if (Array.isArray(queries)) {
    return queries.map((query) => {
      return getIncludeQuery(query);
    });
  } else {
    return [ getIncludeQuery(queries) ];
  }
}

export function isConditionOperatorType(value: string): value is ConditionOperator {
  return CONDITIONS.includes(value as ConditionOperator);
}

export function getClauseQueries(query: string): ClauseGroup {
  const clauses: Clause[] = [];

  for (let result = TOKEN_SPLITTER.exec(query); result !== null; result = TOKEN_SPLITTER.exec(query)) {
    const clause = getClause(result);
    // Handle the case and as no operator
    if (!clause.isCondition && clauses.length > 0 && !clauses[clauses.length - 1].isCondition) {
      clauses.push({
        operator: 'and',
        clause: 'and',
      });
    }
    clauses.push(clause);
  }

  const clauseStack: (Clause | ClauseGroup)[] = [];
  const opStack: Clause[] = [];

  let previousOp: ConditionOperator | null = null;
  for(let i = 0; i < clauses.length; i++) {
    const currentClause = clauses[i];
    if (currentClause.isCondition) {
      let isCurrentOpLowerPriority = false;
      const currentOperator = currentClause.operator as ConditionOperator;
      if (opStack.length > 0) {
        previousOp = opStack[opStack.length - 1].operator as ConditionOperator;
        isCurrentOpLowerPriority = isFirstOperatorHigherPriority(previousOp, currentOperator);
      }

      if (isCurrentOpLowerPriority) {
        const secondClause = clauseStack.pop();
        const firstClause = clauseStack.pop();
        opStack.pop();

        if (!secondClause || !firstClause) {
          // TODO: proper error message
          throw new QueryParsingError('');
        }
        clauseStack.push({
          clauses: [ firstClause, secondClause ],
          condition: previousOp as ConditionOperator,
        });
      } else {
        opStack.push(currentClause);
      }
    } else {
      clauseStack.push(currentClause);
    }
  }

  let currentOp = null;
  while(currentOp = opStack.pop()) {
    const firstClause = clauseStack.pop();
    const secondClause = clauseStack.pop();
    if (firstClause === undefined || secondClause === undefined) {
      // TODO: proper error message
      throw new QueryParsingError('');
    }

    const group: ClauseGroup = {
      condition: currentOp.operator as ConditionOperator,
      clauses: [ secondClause, firstClause ],
    };

    clauseStack.push(group);
  }
  const resultClause: ClauseGroup = isType<Clause>(clauseStack[0], 'clause') ?
    { condition: 'and', clauses: [ clauseStack[0] ] } : clauseStack[0];
  return resultClause;
}

function isFirstOperatorHigherPriority(firstOp: ConditionOperator, secondOp: ConditionOperator) {
  return firstOp === 'and' && secondOp === 'or';
}

function getIncludeQuery(rawField: string) {
  const includes = parseIncludeQuery(rawField);
  const queue: IncludeQueryToken[] = [];

  for (let i = 0; i < includes.length; i++) {
    const fieldToken = includes[i];
    if (i === 0) {
      queue.push({ field: fieldToken.token, depth: fieldToken.depth, isInclude: true });
    } else {
      const previousToken = queue[queue.length - 1];
      const currentToken = { field: fieldToken.token, depth: fieldToken.depth, isInclude: fieldToken.isInclude };
      if (previousToken.depth < fieldToken.depth) {

        if (!previousToken.children) {
          previousToken.children = [];
        }
        previousToken.children.push(currentToken);
        
        if (i + 1 < includes.length && includes[i + 1].depth > fieldToken.depth) {
          queue.push(currentToken);
        } else if (i + 1 < includes.length && includes[i + 1].depth < fieldToken.depth) {
          queue.pop();
        }
      } else {
        queue.push(currentToken);
      }
    }
  }

  return queue[0] as IncludeQueryToken;
}

function parseIncludeQuery(rawField: string) {
  const tokens = rawField.split(INCLUDE_SPLITTER);
  const result: {
    depth: number;
    token: string;
    isInclude: boolean;
  }[] = [];
  let depth = 0;

  tokens.forEach((token, index) => {
    let isInclude = index === 0;
    if(!token) return;
    if(token === '[') {
      depth++;
      return;
    }
    if(token === ']') {
      depth--;
      return;
    }
    // TODO: move (in) to a constant
    if (token.startsWith('(in)')) {
      isInclude = true;
    }

    if (token.indexOf(',') > 0) {
      const tokens = token.split(',');
      tokens.forEach(t => {
        result.push({ isInclude, depth: depth, token: t.replace('(in)', '') });
      });
    } else {
      result.push({ isInclude, depth: depth, token: token.replace(',', '').replace('(in)', '') });
    }
  });
  return result;
}

function getClause(match: RegExpExecArray): Clause {
  const clause = match[0];

  // Condition token
  if (isCondition(clause)) {
    const clauseToLowerCase = clause.toLowerCase();
    const operator: ConditionOperator = clauseToLowerCase as ConditionOperator;

    return {
      clause,
      operator,
      isCondition: true,
      offset: {
        start: match.index,
        end: match.index + clause.length,
      },
    };
  }
  
  const parsedClause = clause.match(CLAUSE_SPLITTER);

  // Other cases
  if (parsedClause?.groups) {
    const parsedClauseGroups = parsedClause.groups;
    return {
      clause,
      field: parsedClauseGroups['field'],
      value: formatClauseValue(parsedClauseGroups['value']),
      operator: parsedClauseGroups['operator'] as Operator,
      isExcluded: !!parsedClauseGroups['isExcluded'],
      offset: {
        start: match.index,
        end: match.index + clause.length,
      },
    };
  }
  
  throw new SearchQueryBadRequestError(`Search query ${clause} is not valid.`);
}

function isCondition(clause: string) {
  const toLowerCaseClause = clause.toLowerCase();
  return toLowerCaseClause === 'or' || toLowerCaseClause === 'and';
}

function formatClauseValue(value: string) {
  return removeBacklashesOfEscape(value.replace(SURROUNDING_QUOTES_REGEX, '')).toLowerCase();
}

// Strip backslashes respecting escapes
function removeBacklashesOfEscape(value: string) {
  const formattedValue = value.replace(/\\(.?)/g, function (s, n1) {
    switch (n1) {
    case '\\':
      return '\\';
    case '0':
      return '\u0000';
    case '':
      return '';
    default:
      return n1;
    }
  });

  return formattedValue;
}
