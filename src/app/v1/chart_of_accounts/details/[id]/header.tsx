
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Popover, useTheme } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import React, { useEffect } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { MdOutlineDateRange, MdDateRange } from 'react-icons/md'
import { FaPrint } from "react-icons/fa";
import { useChartOfAccountContext } from '@/v1/context/chartOfAccountProvider'
import { useParams } from 'next/navigation'

const df = 'yyyy-MM-DD'

export default function Header() {
   const activePage = useParams()
   const id: any = activePage.id
   const theme = useTheme()





   const todayRange = { label: 'Today', value: { start_date: moment().format(df), end_date: moment().format(df) } }
   const thisWeekRange = { start_date: moment().startOf('week').subtract(1, 'days').format(df), end_date: moment().endOf('week').subtract(1, 'days').format(df) }
   const thisMonthRange = { start_date: moment().startOf('month').format(df), end_date: moment().endOf('month').format(df) }
   const thisYearRange = { start_date: moment().startOf('year').format(df), end_date: moment().endOf('year').format(df) }
   const prevMonthRange = { start_date: moment().subtract(1, 'month').startOf('month').format(df), end_date: moment().subtract(1, 'month').endOf('month').format(df) }
   const prevYearRange = { start_date: moment().subtract(1, 'year').startOf('year').format(df), end_date: moment().subtract(1, 'year').endOf('year').format(df) }




   const [dateRange, setDateRange] = React.useState('This Month')
   const [start_date, setStartDate] = React.useState(thisMonthRange.start_date)
   const [end_date, setEndDate] = React.useState(thisMonthRange.end_date)
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [dateRangeAnchor, setDateRangeAnchor] = React.useState<null | HTMLElement>(null);


   const menuItems: { label: string, value: any }[] = [
      { label: 'Today', value: todayRange },
      { label: 'This Week', value: thisWeekRange },
      { label: 'This Month', value: thisMonthRange },
      { label: 'This Year', value: thisYearRange },
      { label: 'Previous Month', value: prevMonthRange },
      { label: 'Previous Year', value: prevYearRange },
      { label: 'Custom', value: 'custom' },
   ]


   const { state, setState, fetchDataById } = useChartOfAccountContext()
   useEffect(() => {
      console.log(start_date, end_date)
      fetchDataById(id, { page: 1, limit: 10, start_date, end_date })
   }, [dateRange])



   return (
      <Box p={2} bgcolor={theme.palette.mode == 'dark' ? 'rgba(0,0,0,0.2)' : "rgba(255,255,255,0.8)"} sx={{ backdropFilter: "blur(5px)", boxShadow: 1 }} display={'flex'} justifyContent={"space-between"} top={0} position={'sticky'} >
         {/* left =========>>>> */}
         <Button
            variant='outlined'
            startIcon={<MdOutlineDateRange />}
            endIcon={<IoIosArrowDown />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
         >{dateRange}</Button>
         <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
         >
            {menuItems.map((item) => (
               <MenuItem
                  onClick={(e) => {
                     if (item.value == 'custom') {
                        setDateRangeAnchor(e.currentTarget)
                     } else {
                        setStartDate(item.value.start_date)
                        setEndDate(item.value.end_date)
                        setDateRange(item.label)
                        setAnchorEl(null)

                     }
                  }}
                  sx={{ p: 2, px: 5, pr: 7 }} key={item.label}>
                  <ListItemIcon>
                     <MdDateRange />
                  </ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
               </MenuItem>
            ))}

         </Menu>
         <Popover
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'left',
            }}
            anchorEl={dateRangeAnchor}
            open={Boolean(dateRangeAnchor)}
            onClose={() => setDateRangeAnchor(null)}
         >
            <Box p={2} >
               <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                     minDate={moment('2020')}
                     maxDate={moment().add(1, 'month')}
                     slotProps={{
                        textField: { size: 'small' },
                        actionBar: {
                           actions: ['today', 'cancel', 'accept'],
                        },
                     }}
                     sx={{ my: 1 }} label='From'
                     value={moment(start_date)}
                     onChange={(value) => setStartDate(moment(value).format(df))}
                  />
                  <br />
                  <DatePicker
                     minDate={moment('2020')}
                     maxDate={moment().add(1, 'day')}
                     slotProps={{
                        textField: { size: 'small' },
                        actionBar: {
                           actions: ['today', 'cancel', 'accept'],
                        },
                     }}
                     value={moment(end_date)}
                     onChange={(value) => setEndDate(moment(value).format(df))}
                     sx={{ my: 1 }}
                     label='To'
                  />
                  <br />
               </LocalizationProvider>

               <Button
                  onClick={() => {
                     setDateRange('custom')
                     setAnchorEl(null)
                     setDateRangeAnchor(null)
                  }}
                  color='success' size='small' variant='contained' sx={{ float: "right", my: 2, ml: 2 }}>apply</Button>
               <Button
                  onClick={() => {
                     setAnchorEl(null)
                     setDateRangeAnchor(null)
                  }}
                  size='small' sx={{ float: "right", my: 2 }}>cancel</Button>
            </Box>
         </Popover>
         {/* left =========<<<< */}
         <Box >
            <Button variant='outlined' startIcon={<FaPrint />}>Pdf</Button>
            <Button variant='outlined' startIcon={<FaPrint />}>Pdf</Button>
            <Button variant='outlined' >Export</Button>
         </Box>


      </Box>
   )
}
