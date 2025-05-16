import { CodeRule } from '@prisma/client';

import { createHandlers, HandlerArgs } from '@/lib/api';
import { prisma as prismadb } from '@/lib/prisma';
import { codeRuleFormSchema } from '@/schemas/code-rule';
import { ResponseBody } from '@/types/common';

async function createCodeRule({ routeRequest }: HandlerArgs) {
  const savedCode = await prismadb.codeRule.create({
    data: routeRequest.payload,
  });

  return savedCode;
}

async function getCodeRules() {
  const allCodeRules = await prismadb.codeRule.findMany({
    where: { active: true },
  });

  const response: ResponseBody<CodeRule[]> = {
    data: allCodeRules,
  };
  return response;
}

module.exports = createHandlers([
  {
    method: 'POST',
    handler: createCodeRule,
    config: {
      payloadSchema: codeRuleFormSchema,
      auth: true,
    },
  },
  {
    method: 'GET',
    handler: getCodeRules,
    config: {
      auth: true,
    },
  },
]);
