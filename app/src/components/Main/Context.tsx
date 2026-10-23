import React,   { createContext, FC, useEffect, useState } from "react";

const bodyElement = document.getElementById('body');


export type Theme = 'light' | 'dark';

export type ContextProp = {
    theme: Theme,
    toggleTheme: () => void
}

export const context:ContextProp = {
    theme: 'light',
    toggleTheme() {}
}


export const ThemeContext = createContext<ContextProp>(context);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // тема восстанавливается из localStorage, по умолчанию dark
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  });

  useEffect(() => {
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
          bodyElement.classList.add('dark')
      } else {
          bodyElement.classList.remove('dark')
      }
    }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
