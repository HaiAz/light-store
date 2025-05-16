import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);

export function generateNanoId(prefix: string = '', suffix: string = '') {
  const id = nanoid();

  return `${prefix}${id}${suffix}`;
}
