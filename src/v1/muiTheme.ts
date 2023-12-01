import { Theme, createTheme } from '@mui/material';

import { red, blue, cyan } from '@mui/material/colors';

export const darkTheme: Theme = createTheme({
   palette: {
      mode: 'dark',

      background: {
         default: '#333',
         paper: '#222'
      },
      text: {
         // primary: '#fff',
         // secondary: 'cyan',
         // disabled: '#def'
      },
      

   },
   
});
export const lightMode: Theme = createTheme({
   palette: {
      mode: 'light',
      // background: {
      //    default: '#e7fcff',
      //    paper: '#fff'
      // },


      // text: {
      //    // primary: '#000000de',
      //    secondary: blue['600'],

      // },


   },
});