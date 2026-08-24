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
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
      if (theme === 'dark') {
          bodyElement.classList.add('dark')
      } else {
          bodyElement.classList.remove('dark')
      }
    }, [])
    
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (bodyElement) {
        if (prevTheme === 'light') {
          bodyElement.classList.add('dark')
        } else {
          bodyElement.classList.remove('dark')
        }
      }

      return prevTheme === 'light' ? 'dark' : 'light'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
