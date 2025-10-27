import { useState } from 'react';

/**
 * Custom Hook: useCounter
 * Demonstrates hook pattern with state management
 */

export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);
  const setValue = (value: number) => setCount(value);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
}
