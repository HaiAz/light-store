import { z } from 'zod';

import { baseEntitySchema } from '@/schemas/common';

const supportedCodeTypes = [ 'product', 'customer' ] as const;
type CodeRuleType = (typeof supportedCodeTypes)[number];

const codeRuleFormSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  type: z.union([
    z.literal('product'),
    z.literal('customer'),
  ]),
  description: z.string().optional(),
  delimiter: z.string().length(1).default('-'),
  active: z.coerce.boolean().default(false),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  rule: z.string(),
  autoNumber: z.coerce.number().int().min(1).default(1),
});

const codeRuleSchema = codeRuleFormSchema.extend(baseEntitySchema);
type CodeRule = z.infer<typeof codeRuleSchema>;
type CodeRuleForm = z.infer<typeof codeRuleFormSchema>;

type RuleParser = {
  prefix: string | null;
  suffix: string | null;
  autoNumber: string;
  delimiter: string;
};

export {
  codeRuleFormSchema,
  codeRuleSchema,
  type RuleParser,
  type CodeRuleType,
  type CodeRule,
  type CodeRuleForm,
};
