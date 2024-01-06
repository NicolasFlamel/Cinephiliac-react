import { ScoreData, Dispatcher } from '../types';
import { useState, useEffect } from 'react';

function getStorageValue(key: string, defaultValue: ScoreData[]): ScoreData[] {
  // getting stored value
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  else return defaultValue;
}

export const useLocalStorage = (
  key: string,
  defaultValue: ScoreData[] | [] = [],
): [ScoreData[], Dispatcher<ScoreData[]>] => {
  const [value, setValue] = useState(getStorageValue(key, defaultValue));

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
