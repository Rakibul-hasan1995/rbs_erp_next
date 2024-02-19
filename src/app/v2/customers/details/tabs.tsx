
'use client';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import useSearchParamsHook from '@/v1/hooks/useSearchParams';





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

export default function CustomerTabs() {
   const { pushQuery, searchParams } = useSearchParamsHook()
   const theme = useTheme();
   const tab = searchParams.get('tab') || 0
   const [value, setValue] = React.useState(+tab);

   React.useEffect(() => {
      setValue(+tab)
   }, [tab])




   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      pushQuery({ tab: newValue })
      setValue(newValue);
   };
   const handleChangeIndex = (index: number) => {
      setValue(index);
   };
   // end tab functions


   return (
      <Box sx={{ bgcolor: 'background.paper', }}>
         {/* <AppBar position="static" sx={{bgcolor: "transparent", color: theme.palette.primary.main}} >
            <Tabs
               value={value}
               onChange={handleChange}
               indicatorColor="secondary"

               textColor="inherit"
               variant="fullWidth"
               aria-label="full width tabs example"
            >
               <Tab label="Overview" {...a11yProps(0)} />
               <Tab label="Orders" {...a11yProps(1)} />
               <Tab label="Statement" {...a11yProps(2)} />
            </Tabs>
         </AppBar> */}
         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
               <Tab label="Overview" {...a11yProps(0)} />
               <Tab label="Item Two" {...a11yProps(1)} />
               <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
         </Box>
         <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
         >
            <TabPanel value={value} index={0} dir={theme.direction}>
               <Typography>hallo1</Typography>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
               <Typography>hallo2</Typography>

            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
               <Typography>hallo3</Typography>

            </TabPanel>

         </SwipeableViews>
      </Box>
   );
}

