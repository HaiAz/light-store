import { useEffect, useState } from 'react';

const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [ value, setValue ] = useState<T | null>(() => {
    let currentValue: T;

    try {
      const val = localStorage.getItem(key);
      currentValue = val ? JSON.parse(val) : defaultValue;
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [ value, key ]);

  return [ value, setValue ];
};

export default useLocalStorage;
