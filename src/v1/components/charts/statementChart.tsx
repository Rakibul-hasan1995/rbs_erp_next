

import * as React from 'react'
import _groupData from "../../utils/groupData"
import { ApexOptions } from "apexcharts"
import { numberWithCommas } from "../../utils/numberFormater"
import ChartComponent from '../Charts'
import { Box, Button, ButtonGroup, Card, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { _arrSum } from '@/v1/utils/arrSum'
import ChartLoading from '../loading/ChartLoading'
import { Statement } from '../customers/Statements'

const GroupChart = ({ invoice, payments, statement }: { invoice: any, payments: any, statement?: Statement }) => {

   const [activeButton, setActiveButton] = React.useState<'day' | 'month' | 'year'>('month')

   const [invoiceData, setInvoiceData] = React.useState([])
   const [paymentData, setPaymentData] = React.useState([])
   React.useEffect(() => {
      const df = {
         day: 'DD-MMM-YY',
         month: "MMM-YY",
         year: "yyyy"
      }
      setPaymentData(_groupData(payments, 'x', 'y', activeButton, df[activeButton]))
      setInvoiceData(_groupData(invoice, 'x', 'y', activeButton, df[activeButton]))
   }, [activeButton, payments])

   const options: ApexOptions = {
         series: [
            {
               data: Object.values(invoiceData),
               name: 'Invoice'
            },
            {
               data: Object.values(paymentData),
               name: 'Payments'
            },
         ],


      chart: {
         type: 'bar',
         height: 300,
         background: 'transparent',
         toolbar: {
            show: false
         },
      },
      xaxis: {
         type: "category"
      },

      yaxis: {
         labels: {
            show: false
         },
         title: {
            text: 'title',
            style: {
               fontSize: '20px'
            }
         }
      },
      plotOptions: {
         bar: {
            borderRadius: 2,
            dataLabels: {
               position: 'top', // top, center, bottom
            },
         }
      },
      dataLabels: {
         enabled: Boolean(activeButton !== 'day'),
         formatter: function (val) {
            return numberWithCommas(+val / 100000);
         },
         offsetY: -20,
         style: {
            fontSize: '12px',
            colors: undefined,
            fontFamily: 'roboto'
         }
      },
      tooltip: {
         y: {
            formatter: function (val: any) {
               return numberWithCommas(val);
            },
            title: {
               formatter: (seriesName: any) => seriesName,
            },
         },
      },
      // title: {
      //    text:`Total =`
      // }
   };
   return (
      <Box>
         <Box>
            <Grid container>
               <Grid item>
                  <Box component={Paper} p={3} m={2}>
                     <Typography fontSize={11}>Total Bill Amount</Typography>
                     {statement ? <Typography color={'skyblue'} variant='h6'>{numberWithCommas(statement?.debitAmount)}</Typography> :
                        <Skeleton width={60} sx={{ fontSize: '24px' }} />
                     }
                  </Box>
               </Grid>
               <Grid item>
                  <Box component={Paper} p={3} m={2}>
                     <Typography fontSize={11}>Total Pay Amount</Typography>
                     {statement ? <Typography color={'skyblue'} variant='h6'>{numberWithCommas(statement?.creditAmount)}</Typography> : <Skeleton width={60} sx={{ fontSize: '24px' }} />}
                  </Box>
               </Grid>
               <Grid item>
                  <Box component={Paper} p={3} m={2}>
                     <Typography fontSize={11}>Total Deu Amount</Typography>
                     {statement ? <Typography fontWeight={'bold'} color={'red'} variant='h6'>{numberWithCommas(statement?.deuAmount)}</Typography> : <Skeleton width={60} sx={{ fontSize: '24px' }} />}
                  </Box>
               </Grid>
            </Grid>
         </Box>
         <Box component={Paper} position={'relative'}>
            <Box m={2} position={'absolute'} zIndex={2} right={0}>
               <ButtonGroup variant="contained" size='small' aria-label="outlined primary button group">
                  <Button onClick={() => { setActiveButton('day') }} color={activeButton == 'day' ? 'success' : 'info'}>Day</Button>
                  <Button onClick={() => { setActiveButton('month') }} color={activeButton == 'month' ? 'success' : 'info'}>Month</Button>
                  <Button onClick={() => { setActiveButton('year') }} color={activeButton == 'year' ? 'success' : 'info'}>Year</Button>
               </ButtonGroup>
            </Box>
            {Object.values(invoiceData).length ? <ChartComponent chartOptions={options} /> : <ChartLoading />}
         </Box>
      </Box>
   )
}

export default GroupChart
