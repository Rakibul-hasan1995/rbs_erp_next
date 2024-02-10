
import { Box, Button, Popover, useTheme, Pagination, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import React, { useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io'
import { MdDateRange } from 'react-icons/md';
import { FaPrint } from "react-icons/fa";
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useChartOfAccountContext } from '../../chartOfAccountProvider'
import UiMenu from '@/v1/components/menu/UiMenu'
import { objToQueryString } from '@/v1/utils/queryString';
import { queryStringToJSON } from '../../../../../v1/utils/queryString'
import { prevMonthRange, prevYearRange, thisMonthRange, thisWeekRange, thisYearRange, todayRange } from '@/v1/utils/dateRanges'

const df = 'yyyy-MM-DD'

export default function Header() {
   const router = useRouter()
   const theme = useTheme()
   const searchParams = useSearchParams()
   const date_range_name = searchParams.get('date_range_name')




   const [start_date, setStartDate] = React.useState(thisMonthRange.start_date)
   const [end_date, setEndDate] = React.useState(thisMonthRange.end_date)
   const [dateRangeAnchor, setDateRangeAnchor] = React.useState<any>(null);

   const pathName = usePathname()
   const searchQuery = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
   const pushTo = (value: any) => {
      const qu = objToQueryString({ ...queryStringToJSON(searchQuery), ...value })
      router.push(`${pathName}?` + qu)
   }




   const menuItemsJson = [
      {
         icon: <MdDateRange />, title: 'Today',
         onClick: () => pushTo({ ...todayRange, date_range_name: 'Today' })
      },
      {
         icon: <MdDateRange />, title: 'This Week',
         onClick: () => pushTo({ ...thisWeekRange, date_range_name: 'This Week' })
      },
      {
         icon: <MdDateRange />, title: 'This Month',
         onClick: () => pushTo({ ...thisMonthRange, date_range_name: 'This Month' })
      },
      {
         icon: <MdDateRange />, title: 'This Year',
         onClick: () => { pushTo({ ...thisYearRange, date_range_name: 'This Year' }) }
      },
      { icon: <MdDateRange />, title: 'Previous Month', onClick: () => { pushTo({ ...prevMonthRange, date_range_name: 'Previous Month' }) } },
      { icon: <MdDateRange />, title: 'Previous Year', onClick: () => { pushTo({ ...prevYearRange, date_range_name: 'Previous Year' }) } },
      {
         icon: <MdDateRange />, title: 'Custom', onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            setDateRangeAnchor(5)

         }
      },
   ]

   const { state } = useChartOfAccountContext()

   return (
      <Box
         p={2}
         bgcolor={theme.palette.mode == 'dark' ? 'rgba(0,0,0,0.2)' : "rgba(255,255,255,0.8)"}
         sx={{ backdropFilter: "blur(5px)", boxShadow: 1 }}
         display={'flex'} justifyContent={"space-between"}
         top={0} position={'sticky'} >
         {/* left =========>>>> */}
         <Box display={"flex"} gap={5} alignItems={"center"}>
            <UiMenu title={date_range_name || 'This Month'}
               buttonProps={{ endIcon: <IoIosArrowDown />, variant: 'outlined' }}
               itemJson={menuItemsJson}
            />

            <Popover
               anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
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
                        setDateRangeAnchor(null)
                        pushTo({ start_date, end_date, date_range_name: 'Custom' })
                     }}
                     color='success' size='small' variant='contained' sx={{ float: "right", my: 2, ml: 2 }}>apply</Button>
                  <Button
                     onClick={() => {
                        setDateRangeAnchor(null)
                     }}
                     size='small' sx={{ float: "right", my: 2 }}>cancel</Button>
               </Box>
            </Popover>


            <Pagination
               count={state?.account?.pagination?.totalPages || 1}
               showFirstButton
               showLastButton
               page={state.account?.pagination?.currentPage || 0 + 1}
               onChange={(x, page) => {
                  pushTo({ page })
                  // fetchDataById(id, { page, start_date, end_date, expand: 'true' })
               }}
               size='small'
            />
            <Typography>Total Count: {state.account?.pagination?.totalDocuments}</Typography>
         </Box>




         {/* left =========<<<< */}
         <Box >
            <Button variant='outlined' startIcon={<FaPrint />}>Pdf</Button>
            <Button variant='outlined' startIcon={<FaPrint />}>Pdf</Button>
            <Button variant='outlined' >Export</Button>
         </Box>


      </Box>
   )
}
