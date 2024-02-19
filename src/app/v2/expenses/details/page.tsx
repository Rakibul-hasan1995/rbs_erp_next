'use client'
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox'
import { Alert, Box, Button, ButtonBase, Divider, Link, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { TransactionNotFound } from '../../chart_of_accounts/list/[...query]/TransactionNotFound'
import NextLink from 'next/link'
import Header from '../../chart_of_accounts/details/[id]/header'
import { thisMonthRange } from '@/v1/utils/dateRanges'
import { useSearchParams } from 'next/navigation'
import { BiExport } from 'react-icons/bi'
import useTransactionServices from '../useTransactionServices'
import { TransactionQueryParams } from '@/types/transaction'
import exportFromJSON from 'export-from-json'




export default function Page() {

   const { fetchTransactions, transactions, loading, } = useTransactionServices({ storeData: true })

   const searchParams = useSearchParams()

   const date_range_name = searchParams.get('date_range_name')

   const limit = searchParams.get('limit')
   const page = searchParams.get('page')
   const start_date = searchParams.get('start_date')
   const end_date = searchParams.get('end_date')
   const search = searchParams.get('search')
   const search_by: any = searchParams.get('search_by')
   const sort_by = searchParams.get('sort_by')
   const sort_type = searchParams.get('sort_type') !== 'desc' ? 'desc' : 'asc'

   const xy: TransactionQueryParams = {
      limit: limit || '200',
      page: page || '1',
      start_date: start_date || thisMonthRange.start_date,
      end_date: end_date || thisMonthRange.end_date,
      search: search || 'Expense',
      search_by: search_by || 'type',
      sort_key: sort_by || 'createdAt',
      sort_type: sort_type,
   }


   useEffect(() => {
      fetchTransactions({ ...xy, is_debit: 'true', })
   }, [date_range_name, page, start_date, end_date, limit, search, sort_by, sort_type])



   const theme = useTheme()



   const handleExport = () => {
      const fileName = `expense-${transactions?.dateRange}`
      if (!transactions?.data.length) {
         return alert('No Data Found For Export')
      }
      const data = transactions?.data.map((item) => (
         {
            'Date': item.date_formatted,
            'Expense Account': item.paid_to_account.account_name,
            "Reference": item.reference,
            'Supplier': item.supplier_id?.user_name,
            'Description': item.description,
            'Amount': item.debit_amount_formatted
         }
      ))

      data.unshift({ 'Date': '', "Expense Account": transactions.dateRange, "Reference": "", "Supplier": '', 'Description': '', 'Amount': "" })
      data.unshift({ 'Date': '', "Expense Account": 'Expense Summery', "Reference": "", "Supplier": '', 'Description': '', 'Amount': "" })
      data.unshift({ 'Date': '', "Expense Account": 'Monapy Embroidery', "Reference": "", "Supplier": '', 'Description': '', 'Amount': "" })

      const exportType = exportFromJSON.types.csv
      exportFromJSON({ data, fileName, exportType, })
   }



   const HeaderRight = () => {
      return (
         <Stack direction={'row'} spacing={3}>
            {!loading.transactions && Boolean(transactions?.data?.length) &&
               <Button
                  disabled={!transactions?.data.length}
                  variant='outlined'
                  startIcon={<BiExport />}
                  onClick={handleExport}
               >
                  Export
               </Button>
            }
         </Stack>
      )
   }



   return (
      <CustomScrollbarBox height={`calc(100vh - 64px)`} bgcolor={theme.palette.background.paper} >

         <Header pagination={transactions?.pagination} right={<HeaderRight />} />
         <Box component={Paper} p={2} mx={'auto'} height={`calc(100vh - 000px)`} textAlign={'center'} >
            <Typography fontSize={22} pt={5}>Monapy Embroidery</Typography>
            <Typography fontSize={30}>Expense Summary</Typography>
            <Typography fontSize={13} my={2}>{transactions?.dateRange}</Typography>
            <Divider />
            {transactions?.data?.length ?
               <CustomScrollbarBox sx={{ maxHeight: `calc(100vh - 200px)` }} >
                  <Table size='medium' stickyHeader >
                     <TableHead   >
                        <TableRow>
                           <TableCell >
                              Date
                           </TableCell >
                           <TableCell >
                              Expense Account
                           </TableCell >
                           <TableCell >
                              Reference
                           </TableCell >
                           <TableCell >
                              Supplier
                           </TableCell >
                           <TableCell >
                              Descriptions
                           </TableCell >
                           <TableCell align='right'>
                              Amount
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {transactions.data?.map((item) => (
                           <TableRow hover component={NextLink} href={`/v2/expenses?selected=${item._id}`} key={item._id} sx={{ textDecoration: 'auto' }} >
                              <TableCell>
                                 {item.date_formatted}
                              </TableCell>
                              <TableCell
                              >
                                 <Link component={NextLink} href={`/v2/chart_of_accounts/details/${item.paid_to_account._id}?start_date=${start_date}&end_date=${end_date}&date_range_name=${date_range_name}`} >
                                    {item.paid_to_account.account_name}
                                 </Link>
                              </TableCell>
                              <TableCell>
                                 {item.reference}
                              </TableCell>
                              <TableCell>
                                 {item.supplier_id?.user_name}
                              </TableCell>
                              <TableCell>
                                 {item.description}
                              </TableCell>
                              <TableCell
                                 align='right'
                              >
                                 <Link component={NextLink} href={`/v2/chart_of_accounts/details/${item._id}?start_date=${start_date}&end_date=${end_date}&date_range_name=${date_range_name}`} >
                                    {item.debit_amount_formatted}
                                 </Link>
                              </TableCell>
                           </TableRow>
                        ))}
                        {/* <TableRow >
                           <TableCell sx={{ fontSize: 15, fontWeight: '700' }}>
                              Total
                           </TableCell>
                           <TableCell
                              sx={{ fontSize: 15, fontWeight: '700' }}
                              align='right'
                           >
                              {transactions.total_formatted}
                           </TableCell>
                        </TableRow> */}

                     </TableBody>
                  </Table>
                  <Box height={80} />
               </CustomScrollbarBox>
               :
               <TransactionNotFound />
            }
         </Box >
      </CustomScrollbarBox >

   )
}
