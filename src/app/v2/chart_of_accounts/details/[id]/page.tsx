'use client';;
import {
   Box,
   Divider,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography,
   useTheme,
   Link
} from '@mui/material';
import Header from './header'

import NextLink from 'next/link';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { TransactionNotFound } from '../../list/[...query]/TransactionNotFound';
import { useChartOfAccountContext } from '../../chartOfAccountProvider';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { thisMonthRange } from '@/v1/utils/dateRanges';

function Page() {
   const { state, fetchDataById } = useChartOfAccountContext()
   const activePage = useParams()
   const id = activePage.id

   const searchParams = useSearchParams()
   const xy: any = {
      limit: searchParams.get('limit') || 100,
      page: searchParams.get('page') || 1,
      sort_by: searchParams.get('sort_by'),
      sort_type: searchParams.get('sort_type'),
      end_date: searchParams.get('end_date') || thisMonthRange.end_date,
      start_date: searchParams.get('start_date') || thisMonthRange.start_date
   }

   const date_range_name = searchParams.get('date_range_name')
   const page = searchParams.get('page')

   useEffect(() => {
      fetchDataById(`${id}`, { ...xy, expand: 'true', sort_key: 'createdAt', sort_type: "desc" })
   }, [date_range_name, page])

   const theme = useTheme()
   return (
      <CustomScrollbarBox height={`calc(100vh - 64px)`} bgcolor={theme.palette.background.paper} >
         {/* header =============>>>>> */}
         <Header />
         {/* header =============<<<< */}
         <Box height={`calc(100vh - 105px)`} textAlign={'center'} >
            <Typography fontSize={22} pt={5}>Monapy Embroidery</Typography>
            <Typography fontSize={30}>Account Transactions</Typography>

            <Typography fontSize={22} fontWeight={"600"} color={'Highlight'}>{state.account?.account_name}</Typography>
            <Typography fontSize={11} my={2}>{state.account?.dateRange}</Typography>
            <Divider />

            {state.account?.transactions?.length ?

               <CustomScrollbarBox sx={{ maxHeight: `calc(100vh - 135px)` }} >
                  <Table stickyHeader sx={{ bgcolor: theme.palette.background.paper }} >
                     <TableHead   >
                        <TableRow>
                           <TableCell>
                              Date
                           </TableCell>
                           <TableCell>
                              Transaction Details
                           </TableCell>
                           <TableCell>
                              Reference
                           </TableCell>
                           <TableCell>
                              Type
                           </TableCell>
                           <TableCell
                              align='right'
                           >
                              Debit
                           </TableCell >
                           <TableCell
                              align='right'
                           >
                              Credit
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>

                        {state.account.transactions?.map((item) => (
                           <TableRow key={item._id}>
                              <TableCell>
                                 {item.date_formatted}
                              </TableCell>
                              <TableCell>
                                 {item.transaction_details}
                              </TableCell>
                              <TableCell>
                                 {item.reference}
                              </TableCell>
                              <TableCell>
                                 {item.type}
                              </TableCell>
                              <TableCell
                                 align='right'
                              >
                                 {item.type && item.debit_amount !== 0 ?
                                    <Link component={NextLink} href={item.type == 'Expense' ? `/v2/expenses?selected=${item._id}` : '#'} >
                                       {item.debit_amount_formatted}
                                    </Link>
                                    : item.debit_amount_formatted}
                              </TableCell>
                              <TableCell
                                 align='right'
                              >
                                 {item.type && item.credit_amount !== 0 ?
                                    <Link component={NextLink} href={item.type == 'Expense' ? `/v2/expenses?selected=${item._id}` : '#'} >
                                       {item.credit_amount_formatted}
                                    </Link>
                                    : item.credit_amount_formatted
                                 }
                              </TableCell>
                           </TableRow>
                        ))}

                     </TableBody>
                  </Table>

               </CustomScrollbarBox>
               :
               <TransactionNotFound />
            }
         </Box>

      </CustomScrollbarBox>
   )
}

export default Page