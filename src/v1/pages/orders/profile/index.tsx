
'use client';;
import { useThemeContext } from '@/v1/context/themeContext';
import { useParams } from 'next/navigation';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import OrderDetails from './OrderDetails';
import { OrderExpand } from '@/v1/utils/Types';
import { Axios } from '@/v1/utils/axios-config';
import { Breadcrumbs, Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { Link as MUILink } from '@mui/material';
import { FaLayerGroup, FaUser } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';
import CloneDialog from './clone';


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

export default function OrderProfile() {
   const theme = useTheme();
   const [value, setValue] = React.useState(0);
   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
   };
   const handleChangeIndex = (index: number) => {
      setValue(index);
   };

   const activePage = useParams()
   const id = activePage._id
   const { setTitle } = useThemeContext()



   const [order, setOrder] = React.useState<OrderExpand>()

   const fetch = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/orders/${id}?expand=true`)
         setOrder(data.data)
         console.log(data)
      } catch (error) {
         console.log(error)
      }
   }
   React.useEffect(() => {
      fetch()
   }, [])
   React.useEffect(() => {
      if (order) {
         setTitle(`${order.program_name} ${order.order_name}`)
      }
      return () => {
         setTitle('RBS')
      }
   }, [order])


   const handleClone = () => {

   }



   return (
      <Box position={'relative'}>
         <Breadcrumbs aria-label="breadcrumb">
            <MUILink component={Link} href="/v1/dashboard" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }}>
               <BiSolidDashboard style={{ marginRight: '5px' }} />
               Dashboard
            </MUILink>
            <MUILink component={Link} href="/v1/orders" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }} >
               <FaLayerGroup style={{ marginRight: '5px' }} />
               Orders
            </MUILink>
            <MUILink component={Link} href="#" underline='hover' >
               {order ? `${order?.program_name} ${order?.order_name}` : 'loading...'}
            </MUILink>
         </Breadcrumbs>
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
                  {order && <OrderDetails order={order} />}
               </TabPanel>
               <TabPanel value={value} index={1} dir={theme.direction}>
                  01
               </TabPanel>
               <TabPanel value={value} index={2} dir={theme.direction}>
                  02
               </TabPanel>
            </SwipeableViews>
         </Box>
         <Box right={0} top={0} position={'absolute'}>
            <ButtonGroup size="small" aria-label="small button group" variant='contained' orientation='vertical'>
               {order && <CloneDialog order={order} />}
               <Button>Clone</Button>
               <Button>Clone</Button>
            </ButtonGroup>
         </Box>
      </Box>
   );
}

