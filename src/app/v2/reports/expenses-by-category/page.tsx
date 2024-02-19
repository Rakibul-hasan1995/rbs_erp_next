'use client'
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox'
import { Box, Button, Container, Divider, IconButton, Link, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TransactionNotFound } from '../../chart_of_accounts/list/[...query]/TransactionNotFound'
import NextLink from 'next/link'
import Header from '../../chart_of_accounts/details/[id]/header'
import { thisMonthRange } from '@/v1/utils/dateRanges'
import { useSearchParams } from 'next/navigation'
import { objToQueryString } from '@/v1/utils/queryString'
import { Axios } from '@/v1/utils/axios-config'
import { BlobProvider } from '@react-pdf/renderer'
import ExpenseSummeryByCategoryPDF from './statementPDF'
import { FaPrint } from 'react-icons/fa'
import { BiExport } from 'react-icons/bi'
import exportFromJSON from 'export-from-json'





export default function Page() {
   const [state, setState] = useState<any>({
      loading: false,
   })


   const searchParams = useSearchParams()
   const date_range_name = searchParams.get('date_range_name')
   const page = searchParams.get('page')
   const start_date = searchParams.get('start_date')
   const end_date = searchParams.get('end_date')

   const xy: any = {
      limit: searchParams.get('limit') || 100,
      page: page || 1,
      sort_by: searchParams.get('sort_by'),
      sort_type: searchParams.get('sort_type'),
      start_date: start_date || thisMonthRange.start_date,
      end_date: end_date || thisMonthRange.end_date
   }


   useEffect(() => {
      fetchData({ ...xy, expand: 'true', sort_key: 'createdAt', sort_type: "desc" })
   }, [date_range_name, page, start_date, end_date])

   const fetchData = async (query: any) => {
      try {
         setState((prev: any) => ({ ...prev, loading: true }))

         const queryStr = objToQueryString(query)
         const { data } = await Axios.get(`/api/v2/accounts/expense-by-category?${queryStr}`)
         setState((prev: any) => ({ ...prev, ...data }))

      } catch (error) {
         console.log(error)
      } finally {
         setState((prev: any) => ({ ...prev, loading: false }))
      }
   }

   const theme = useTheme()



   const handleExport = () => {
      const fileName = `expenseSummaryByCat_${state.dateRange}`
      const data = state.data.map((item: any) => ({ 'Category Name': item.account_name, 'Amount': item.amount_formatted }))
      data.push({ "Category Name": 'Total', "Amount": state.total_formatted })
      const exportType = exportFromJSON.types.csv
      exportFromJSON({ data, fileName, exportType, fields: ["Category Name", "Amount"], })
   }



   const HeaderRight = () => {
      return (
         <Stack direction={'row'} spacing={3}>

            {!state.loading && Boolean(state.data?.length) &&
               <BlobProvider document={<ExpenseSummeryByCategoryPDF
                  pageData={{
                     headerTitle: "Expense Summery By Category",
                     dateRange: state.dateRange,
                     rows: state.data,
                     total_formatted: state.total_formatted
                  }} />}>
                  {({ url }) => (
                     <Link style={{ float: 'right' }} href={`${url}`} target="_blank">
                        <Button
                           disabled={!state.data}
                           variant='outlined'
                           startIcon={<FaPrint />}
                        >
                           Pdf
                        </Button>
                     </Link>
                  )}
               </BlobProvider>}
            {!state.loading && Boolean(state.data?.length) &&
               <Button
                  disabled={!state.data}
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

         <Header pagination={state.pagination} right={<HeaderRight />} />
         <Box component={Paper} p={2} width={'220mm'} mx={'auto'} height={`calc(100vh - 000px)`} textAlign={'center'} >
            <Typography fontSize={22} pt={5}>Monapy Embroidery</Typography>
            <Typography fontSize={30}>Expense Summary by Category</Typography>
            <Typography fontSize={13} my={2}>{state?.dateRange}</Typography>
            <Divider />
            {state.data?.length ?
               <CustomScrollbarBox sx={{ maxHeight: `calc(100vh - 135px)` }} >
                  <Table size='small' stickyHeader >
                     <TableHead   >
                        <TableRow>
                           <TableCell >
                              Category Name
                           </TableCell >
                           <TableCell align='right'>
                              Amount
                           </TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {state.data?.map((item: any) => (
                           <TableRow hover key={item._id}>
                              <TableCell>
                                 {item.account_name}
                              </TableCell>
                              <TableCell
                                 align='right'
                              >
                                 <Link component={NextLink} href={`/v2/chart_of_accounts/details/${item._id}?start_date=${start_date}&end_date=${end_date}&date_range_name=${date_range_name}`} >
                                    {item.amount_formatted}
                                 </Link>
                              </TableCell>
                           </TableRow>
                        ))}
                        <TableRow >
                           <TableCell sx={{ fontSize: 15, fontWeight: '700' }}>
                              Total
                           </TableCell>
                           <TableCell
                              sx={{ fontSize: 15, fontWeight: '700' }}
                              align='right'
                           >
                              {state.total_formatted}
                           </TableCell>
                        </TableRow>

                     </TableBody>
                  </Table>
                  <Box height={80} />
               </CustomScrollbarBox>
               :
               <TransactionNotFound />
            }
         </Box>
      </CustomScrollbarBox>

   )
}
