import * as bcrypt from 'bcryptjs';

export async function hashAsync(plain: string) {
  const hashedPassword = await bcrypt.hash(plain, 10);
  return hashedPassword;
}

export async function comparedAsync(plain: string, hash: string) {
  const isSame = await bcrypt.compare(plain, hash);

  return isSame;
}

export function hash(plain: string) {
  return bcrypt.hashSync(plain, 10);
}

export function compare(plain: string, hash: string) {
  return bcrypt.compareSync(plain, hash);
}
