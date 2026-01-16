import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

const MAX_HISTORY_ITEMS = 10;

export const useHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке истории:', error);
    }
  }, []);

  const addToHistory = useCallback((word: string) => {
    if (!word || word.trim().length === 0) {
      return;
    }

    setHistory((prevHistory) => {
      const newHistory = [word, ...prevHistory.filter((w) => w !== word)].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Ошибка при сохранении истории:', error);
      }
      
      return newHistory;
    });
  }, []);

  return { history, addToHistory };
};

