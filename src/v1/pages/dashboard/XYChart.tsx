
'use client';
import * as React from 'react'
import { ApexOptions } from "apexcharts"
import { numberWithCommas } from "../../utils/numberFormater"
import { Box, Button, ButtonGroup, Drawer, Fab, IconButton, Paper, TextField, Typography } from '@mui/material';
import ChartComponent from '@/v1/components/Charts'
import moment from 'moment'
import { Axios } from '@/v1/utils/axios-config'
import { MdDateRange } from 'react-icons/md';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface FetchArgument {
   start: string;
   end: string;
   group_By: 'day' | 'month' | 'year'
}
const XYChart = ({ title = 'Title', path = 'invoices' }) => {

   const [activeButton, setActiveButton] = React.useState<'day' | 'month' | 'year'>('month')

   const [chartData, setChartData] = React.useState([])
   const [startDate, setStartDate] = React.useState(moment('2022-01-01').format('yy-MM-DD'))
   const [endDate, setEndDate] = React.useState(moment().format('yy-MM-DD'))

   const fetch = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/${path}/group-data?start_date=${startDate}&end_date=${endDate}&group_by=${activeButton}`)
         const xy = data.data.map((item: any) => ({ x: getDate(item), y: item.totalAmount }))
         setChartData(xy)
      } catch (error) {
         console.log(error)
      }
   }

   React.useEffect(() => {
      fetch()
   }, [activeButton])


   const getDate = (item: any) => {
      if (activeButton == 'day') {
         const date = `${item.year}-${item.month}-${item.day}`
         return moment(date).format('YY-MMM-DD')
      }
      if (activeButton == 'month') {
         const date = `${item.year}-${item.month}-01`
         return moment(date).format('YY-MMM')
      }
      if (activeButton == 'year') {
         const date = `${item.year}-01-01`
         return moment(date).format('yyyy')
      }
   }

   const options: ApexOptions = {
      series: [
         {
            data: chartData,
            name: title
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
            text: title,
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

   const [state, setState] = React.useState(false);

   return (
      <Box>
         <div>
            <Drawer
               anchor={'right'}
               open={state}
               onClose={() => setState(false)}
            >
               <Box width={'20vw'} p={3} mt={10} textAlign={'center'}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                     <DatePicker label="From"
                        minDate={moment('2021')}
                        maxDate={moment().add(1, 'month')}
                        slotProps={{
                           textField: { size: 'small' },
                           actionBar: {
                              actions: ['today', 'cancel', 'accept'],
                           },
                        }}
                        value={moment(startDate)}
                        onChange={(value) => setStartDate(moment(value?.toString()).format('DD-MMM-YY'))}
                     />
                     <Typography my={3} variant="body1" >to</Typography>
                     <DatePicker label="To"
                        minDate={moment(startDate)}
                        maxDate={moment().add(1, 'month')}
                        slotProps={{
                           textField: { size: 'small' },
                           actionBar: {
                              actions: ['today', 'cancel', 'accept'],
                           },
                        }}
                        value={moment(endDate)}
                        onChange={(value) => setEndDate(moment(value?.toString()).format('DD-MMM-YY'))}
                     />
                     <IconButton color='info' onClick={() => {
                        setState(false)
                        fetch()
                     }}>
                        <FaArrowAltCircleRight />
                     </IconButton>
                  </LocalizationProvider>
               </Box>
            </Drawer>
         </div>
         <Box component={Paper} position={'relative'}>
            <Box m={1} position={'absolute'} zIndex={2} right={0}>
               <ButtonGroup variant="contained" size='small' aria-label="outlined primary button group">
                  <Button onClick={() => { setActiveButton('day') }} color={activeButton == 'day' ? 'success' : 'info'}>Day</Button>
                  <Button onClick={() => { setActiveButton('month') }} color={activeButton == 'month' ? 'success' : 'info'}>Month</Button>
                  <Button onClick={() => { setActiveButton('year') }} color={activeButton == 'year' ? 'success' : 'info'}>Year</Button>
                  <Button onClick={() => setState(true)} color={activeButton == 'day' ? 'success' : 'info'}><MdDateRange /></Button>
               </ButtonGroup>
            </Box>
            <ChartComponent chartOptions={options} />
         </Box>
      </Box>
   )
}

export default XYChart
