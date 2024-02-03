import { Box, styled } from "@mui/material";


export const CustomScrollbarBox = styled(Box)({
   '&::-webkit-scrollbar': {
      width: '0.5em'
   },
   '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.10)',

   },
   '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      // outline: '1px solid slategrey',
      width: '0.1em',
      borderRadius: 10
   },
   overflow: 'auto',
});
