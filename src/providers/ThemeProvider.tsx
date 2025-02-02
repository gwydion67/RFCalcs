import React, { useEffect, useState } from "react";
import { createContext } from "react";

export type ThemeContextProps = {
  theme : 'dark' | 'light',
  toggleTheme : () => void
}

export const ThemeContext = createContext({} as ThemeContextProps);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState(darkMode ? 'dark' : 'light');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }
  //provide theme context 
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme } as ThemeContextProps}>
      {children}
    </ThemeContext.Provider>
  )

}

export default ThemeProvider
