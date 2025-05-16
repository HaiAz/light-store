import { z } from 'zod';

import { baseEntitySchema } from './common';

const COMPANY_TYPE = 'company';
const PRODUCT_TYPE = 'product';

const settingFormSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  value: z.string(),
  type: z.union([
    z.literal(COMPANY_TYPE),
    z.literal(PRODUCT_TYPE),
  ]),
  description: z.string().optional(),
});
type SettingForm = z.infer<typeof settingFormSchema>;

const settingSchema = settingFormSchema.extend(baseEntitySchema);
type Setting = z.infer<typeof settingSchema>;

export {
  type SettingForm,
  type Setting,
  settingFormSchema,
  settingSchema,
  COMPANY_TYPE,
  PRODUCT_TYPE,
};
