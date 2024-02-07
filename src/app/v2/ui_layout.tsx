

'use client'
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightMode } from '@/v1/muiTheme';
import React from 'react';

import { useThemeContext } from '@/v1/context/themeContext';
import { Toaster } from 'react-hot-toast';
import Sidebar from './sidebar';



export default function UiLayout({
   children,
}: {
   children: React.ReactNode
}) {

   const { isDarkMode, toggleDarkMode } = useThemeContext()


   const theme = isDarkMode ? darkTheme : lightMode;

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Box sx={{ width: '100%', height: '100vh' }}>
            <Sidebar >
               {children}
            </Sidebar>
         </Box>
         <Toaster
            position="bottom-left"
            gutter={8}
            // containerStyle={{}}
            toastOptions={{
               // Define default options
               className: "shadow-md bg-white rounded-sm",
               duration: 3000,
               style: { borderRadius: '3px', },
            }}
         />
      </ThemeProvider>
   )
}



