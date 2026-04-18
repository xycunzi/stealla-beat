import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'cyber' | 'dao';

interface ThemeContextProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'cyber',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('cyber');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'cyber' ? 'dao' : 'cyber'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
