import { Prisma } from '@prisma/client';

import { renderTemplate } from '@/lib/common';
import { CodeRuleType, RuleParser } from '@/schemas/code-rule';

type GenerateCodeArgs = { ruleType: CodeRuleType, defaultValue: string, prisma: Prisma.TransactionClient};
const INCREMENT_PADDING = 6;

export async function generateCode({ defaultValue, ruleType, prisma }: GenerateCodeArgs): Promise<string> {
  const currentRule = await prisma.codeRule.findFirst({ where: { active: true, type: ruleType } });

  if (!currentRule) {
    return defaultValue;
  }

  const increasedRule = await prisma.codeRule.update(
    { where: { id: currentRule.id }, data: { autoNumber: { increment: 1 } } }
  );

  const ruleVariables: RuleParser = {
    autoNumber: increasedRule.autoNumber.toString().padStart(INCREMENT_PADDING, '0'),
    delimiter: increasedRule.delimiter,
    prefix: increasedRule.prefix,
    suffix: increasedRule.suffix,
  };

  return renderTemplate(increasedRule.rule, ruleVariables);
}
