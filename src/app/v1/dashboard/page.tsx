
import { Box, Grid } from '@mui/material';
import XYChart from '@/v1/components/charts/XYChart'
import SetTitle from './setTitle';
export default async function Dashboard() {

   return (
      <Box>
         <SetTitle />
         <Grid container gap={1}>
            <Grid item xs={11} sm={5.95}><XYChart path='invoices' title='Invoices' /></Grid>
            <Grid item xs={11} sm={5.95}><XYChart path='payments' title='Payments' /></Grid>
            <Grid item xs={11} sm={5.95}><XYChart path='productions' title='Productions' /></Grid>
         </Grid>
      </Box>
   )
}