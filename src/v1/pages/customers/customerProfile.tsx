
'use client';;
import StatementChart from '@/v1/components/charts/statementChart';
import { useThemeContext } from '@/v1/context/themeContext';
import { Axios } from '@/v1/utils/axios-config';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomerOrders from './customerOrders';
import Statements from './Statements';


export interface Statement {
   debitAmount: number;
   creditAmount: number;
   deuAmount: number;
   customer: string;
   data: StatementData[]
}
export interface StatementData {
   date: string | Date;
   particulars: string;
   page: string;
   debit: number;
   credit: number,
}



interface TabPanelProps {
   children?: React.ReactNode;
   dir?: string;
   index: number;
   value: number;
}

function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`full-width-tabpanel-${index}`}
         aria-labelledby={`full-width-tab-${index}`}
         {...other}
      >
         {value === index && (
            <Box sx={{ p: 3 }} maxHeight={`calc(100vh - 145px)`}>
               {children}
            </Box>
         )}
      </div>
   );
}

function a11yProps(index: number) {
   return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
   };
}

export default function CustomerProfile() {
   const theme = useTheme();
   const [value, setValue] = React.useState(0);
   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
   };
   const handleChangeIndex = (index: number) => {
      setValue(index);
   };
   // end tab functions


   const [invoiceChartData, setInvoiceChartData] = useState([{ x: new Date().toLocaleString(), y: 0 }])
   const [paymentChartData, setPaymentChartData] = useState([{ x: new Date().toLocaleString(), y: 22 }])
   const [statement, setStatement] = useState<Statement>()

   const activePage = useParams()
   const id = activePage._id
   const { setTitle } = useThemeContext()

   useEffect(() => {
      fetch()
      return () => { setTitle('RBS') }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const fetch = async () => {
      try {
         const { data: std } = await Axios.get(`/api/v1/users/${id}/statement`)
         const resData: Statement = std.data
         setTitle(resData.customer)
         setStatement(resData)
         const payData = resData.data.filter((item: any) => item.credit !== 0)
         const invData = resData.data.filter((item: any) => item.debit !== 0)

         const invXy = invData.map((item: any) => {
            return {
               x: item.date.toLocaleString(),
               y: item.debit
            }
         })

         const payXy = payData.map((item: any) => {
            return {
               x: item.date.toLocaleString(),
               y: item.credit
            }
         })

         setPaymentChartData(payXy)
         setInvoiceChartData(invXy)

      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Box sx={{ bgcolor: 'background.paper', }}>
         <AppBar position="static">
            <Tabs
               value={value}
               onChange={handleChange}
               indicatorColor="secondary"

               textColor="inherit"
               variant="fullWidth"
               aria-label="full width tabs example"
            >
               <Tab label="Profile" {...a11yProps(0)} />
               <Tab label="Orders" {...a11yProps(1)} />
               <Tab label="Statement" {...a11yProps(2)} />
            </Tabs>
         </AppBar>
         <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
         >
            <TabPanel value={value} index={0} dir={theme.direction}>
               {paymentChartData && <StatementChart statement={statement} invoice={invoiceChartData} payments={paymentChartData} />}
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
               <CustomerOrders />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
               <Statements data={statement} />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
               Item Three
            </TabPanel>
         </SwipeableViews>
      </Box>
   );
}

