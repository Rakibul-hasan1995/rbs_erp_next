
'use client'
import React, { createContext, useState, useContext } from 'react';

export type Theme = {
   isDarkMode: boolean;
   setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
   toggleDarkMode: () => void;
   setTitle: (arg: string) => void;
   title: string;
};

export const ThemeContext = createContext<Theme | undefined>(undefined);




export const ThemeProvider = ({ children }: { children: any }) => {
   const [isDarkMode, setDarkMode] = useState(true);
   const [title, setTitle] = useState('RBS');

   const toggleDarkMode = () => {
      setDarkMode((prev) => !prev)
   }

   return (
      <ThemeContext.Provider value={{ isDarkMode, setDarkMode, toggleDarkMode, title, setTitle }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useThemeContext = () => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }
   return context;
};
