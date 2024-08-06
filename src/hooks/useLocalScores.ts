import { useState, useEffect } from 'react';
import { ScoreData } from 'types';

const key = 'cinephiliacSB';

const useLocalScores = () => {
  const [scores, setScores] = useState<ScoreData[]>(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String([]));
    } catch {
      currentValue = [];
    }

    return currentValue;
  });

  const addScore = (value: ScoreData) => {
    const newScores = scores.concat([value]);

    setScores(newScores);
  };

  const deleteScore = (id: string) => {
    const newScores = scores.filter((score) => score.id !== id);

    setScores(newScores);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(scores));
  }, [scores]);

  return { scores, addScore, deleteScore };
};

// non-hook versions
export const getScores = (): ScoreData[] => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export const addScore = (value: ScoreData): ScoreData[] => {
  const scores = getScores();
  const newScores = scores.concat([value]);

  localStorage.setItem(key, JSON.stringify(newScores));

  return newScores;
};

export const deleteScores = (id: string): boolean => {
  const scores = getScores();
  const newScores = scores.filter((score) => score.id !== id);

  localStorage.setItem(key, JSON.stringify(newScores));

  return true;
};

export default useLocalScores;
