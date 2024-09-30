import {useState, useEffect} from "react";

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    const initial = JSON.parse(saved!);
    return initial || defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};