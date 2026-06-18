import { useEffect, useState } from 'react';

/**
 * Returns `value` delayed by `delayMs`, resetting the timer on each change
 * (BRU-3573). Used to debounce the fuzzy compute + dispatch into the shared
 * search slice so every keystroke doesn't thrash the sidebar's tree filter.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
};
