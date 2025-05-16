const REPLACE_PARAM_REGEX = /\${(.*?)}/g;
const ARRAY_TOKEN = '[]';
const JSON_START_TOKEN = 'JSON(';
const JSON_END_TOKEN = ')';

function isEmptyObject<T extends {}>(obj: T) {
  return Object.keys(obj).length === 0;
}

function getQueries<T extends Record<string, unknown>>(obj: T): string {
  return `?${getQueriesWithoutStartSymbol(obj)}`;
}

function getQueriesWithoutStartSymbol<T extends Record<string, unknown>>(obj: T): string {
  const allQueries: string[] = [];
  Object.keys(obj)
    .forEach((key) => {
      const value = obj[key as keyof typeof obj];
      if (Array.isArray(value)) {
        const queries = value.map((val) => `${key}=${encodeURIComponent(val)}`);
        allQueries.push(...queries);

      } else {
        allQueries.push(`${key}=${encodeURIComponent(obj[key as keyof typeof obj] as string)}`);
      }
    });
  return (
    `${allQueries.join('&')}`
  );
}

function renderTemplate<T extends Record<string, string | null>>(template: string, obj: T) {
  return template.replace(REPLACE_PARAM_REGEX, (x, g: keyof T) => obj[g] || '');
}

function convertObjToFormData(originObj: Record<string, unknown>) {
  const data = new FormData();

  for (const key in originObj) {
    if (Array.isArray(originObj[key])) {
      const valueArray = originObj[key] as unknown[];
      const fieldKey = `${key}${ARRAY_TOKEN}`;
      valueArray.forEach((item) => {
        data.append(fieldKey, getFormDataValue(item));
      });
    } else {
      data.append(key, getFormDataValue(originObj[key]));
    }
  }

  return data;
}

function convertFormDataToObj(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key.endsWith(ARRAY_TOKEN)) {
      const keyField = key.substring(0, key.length - ARRAY_TOKEN.length);

      if (!result[keyField]) {
        result[keyField] = [];
      }
      (result[keyField] as unknown[]).push(getJsonValue(value));
    } else {
      result[key] = getJsonValue(value);
    }
  });

  return result;
}

function getJsonValue(value: Blob | string) {
  if (value instanceof Blob) {
    return value as Blob;
  }

  const stringValue = value as string;

  if (stringValue.startsWith(JSON_START_TOKEN) && stringValue.endsWith(JSON_END_TOKEN)) {
    const serializedValue = stringValue.substring(JSON_START_TOKEN.length, stringValue.length - JSON_END_TOKEN.length);

    return JSON.parse(serializedValue);
  }

  return stringValue as string;
}

function getFormDataValue(value: unknown) {
  if (value instanceof Blob) {
    return value as Blob;
  } else if (value instanceof Object) {
    return `${JSON_START_TOKEN}${JSON.stringify(value)}${JSON_END_TOKEN}`;
  }

  return value as string;
}

export { isEmptyObject, getQueries, getQueriesWithoutStartSymbol, renderTemplate, convertObjToFormData, convertFormDataToObj };
