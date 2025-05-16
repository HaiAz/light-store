import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useDebounceWithCallback<T>(
  callback: (cValue: T | undefined) => unknown,
  delay?: number
): Dispatch<SetStateAction<T | undefined>> {
  const [ debouncedValue, setDebouncedValue ] = useState<T>();

  useEffect(() => {
    const timer = setTimeout(() => callback(debouncedValue), delay || 300);

    return () => {
      clearTimeout(timer);
    };
  }, [ callback, delay, debouncedValue ]);

  return setDebouncedValue;
}
