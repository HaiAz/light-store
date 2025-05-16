const idStore: Record<string, number> = {};

export function generateId(component: unknown) {
  const key = `${component}`;
  const id = generateNumberId(key);

  return `${key}-${id}`;
}

export function generateNumberId(component: unknown): number {
  const key = `${component}`;

  const currentId = idStore[key];

  if (typeof currentId !== 'number') {
    idStore[key] = 1;
  } else {
    idStore[key] = currentId + 1;
  }

  return idStore[key];
}
