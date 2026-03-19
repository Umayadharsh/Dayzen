import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(
    () => localStorage.getItem('dayzen_dark') === 'true'
  );
  const [accent, setAccent] = useState(
    () => localStorage.getItem('dayzen_accent') || '#b8823a'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dayzen_dark', dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
    localStorage.setItem('dayzen_accent', accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ dark, setDark, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/* Navbar usage example:
   const { dark, setDark } = useTheme();
   <button onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
*/