import { z } from 'zod';

import { CURRENCY_CODES } from '@/configs/configs';

const currencySchema = z.enum(CURRENCY_CODES);

type Currency = z.infer<typeof currencySchema>

export {
  type Currency,
};
