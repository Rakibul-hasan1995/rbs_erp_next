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
} from '@mui/material';
import Header from './header'

import { useChartOfAccountContext } from '@/v1/context/chartOfAccountProvider';
import Link from 'next/link';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { TransactionNotFound } from '../../list/TrnsactionNotFound';


function Page() {

   const { state } = useChartOfAccountContext()

   const theme = useTheme()
   return (
      <CustomScrollbarBox height={`calc(100vh - 97px)`} bgcolor={theme.palette.background.paper} >
         {/* header =============>>>>> */}
         <Header />
         {/* header =============<<<< */}
         <Box height={`calc(100vh - 105px)`} textAlign={'center'} >
            <Typography fontSize={22} pt={5}>Monapy Embroider</Typography>
            <Typography fontSize={30}>Account Transactions</Typography>

            <Typography fontSize={22} fontWeight={"600"} color={'Highlight'}>{state.account?.account_name}</Typography>
            <Typography fontSize={11} my={2}>{state.account?.dateRange}</Typography>
            <Divider />

            {state.account?.transactions?.length ?

               <CustomScrollbarBox sx={{ maxHeight: `calc(100vh - 160px)` }} >
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
                              Type
                           </TableCell>
                           <TableCell>
                              Debit
                           </TableCell>
                           <TableCell>
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
                                 {item.type}
                              </TableCell>
                              <TableCell>
                                 {item.type ?
                                    <Link href={'#'} >
                                       {item.debit_amount_formatted}
                                    </Link>

                                    : item.debit_amount_formatted}
                              </TableCell>
                              <TableCell>
                                 {item.type ?
                                    <Link href={'#'} >
                                       {item.credit_amount_formatted}
                                    </Link>

                                    : item.credit_amount_formatted}
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