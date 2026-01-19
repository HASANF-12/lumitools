import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initialValue: T) {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [index, setIndex] = useState(0);

  const current = history[index];

  const setValue = useCallback((value: T) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(value);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      return true;
    }
    return false;
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return true;
    }
    return false;
  }, [index, history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return {
    current,
    setValue,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}


