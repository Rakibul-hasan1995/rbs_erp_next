import { Statement } from "@/app/v1/customers/profile/[_id]/page"
import CustomerStatementPDF from "@/v1/pdf_pages/statementPDF"
import { numberWithCommas } from "@/v1/utils/numberFormater"
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material"
import { BlobProvider } from "@react-pdf/renderer"
import moment from "moment"
import Link from "next/link"
import { FaPrint } from "react-icons/fa"

const Statements = ({ data }: { data?: Statement }) => {

   return (
      <Box sx={{ userSelect: 'none' }}>
         <Box position={'sticky'} right={0} top={100}>
            {data && <BlobProvider document={<CustomerStatementPDF pageData={data} />}>
               {({ url }) => (
                  <Link style={{float: 'right'}} href={`${url}`} target="_blank">
                     <IconButton color="info" >
                        <FaPrint />
                     </IconButton>
                  </Link>
               )}
            </BlobProvider>}
         </Box>
         {data &&
            <>

               <Box component={Paper} width={'220mm'} minHeight={'290mm'} mx={'auto'} sx={{ color: 'black' }} position={'relative'} pt={2} bgcolor={'white'}>
                  <img src="https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png" width={'100%'} />
                  <Box px={8} >
                     <Typography my={1} fontWeight={'bold'}>Sub Ladger For: {data.customer}</Typography>
                     <Table size="small" sx={{ color: 'black', textEmphasisColor: 'black' }} >
                        <TableHead>
                           <TableRow>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '25%', color: 'black', fontWeight: 'bold' }}>Date</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '5%', color: 'black', fontWeight: 'bold' }}>Particulars</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '20%', color: 'black', fontWeight: 'bold' }}>Page</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Debit</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Credit</TableCell>

                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {data?.data.map((item, i) => (
                              <TableRow key={i} >
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>{moment(item.date).format('DD-MMM-YY')}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}> {item.particulars}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>{item?.page}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="right">{numberWithCommas(item.debit)}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }} align="right">{numberWithCommas(item.credit)}</TableCell>
                              </TableRow>
                           ))}

                        </TableBody>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '25%', color: 'black', fontWeight: 'bold' }}>Total</TableCell>
                              <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>{numberWithCommas(data.debitAmount)}</TableCell>
                              <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>{numberWithCommas(data.creditAmount)}</TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '25%', color: 'black', fontWeight: 'bold' }}>Deu</TableCell>
                              <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>{numberWithCommas(0)}</TableCell>
                              <TableCell align="right" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>{numberWithCommas(data.deuAmount)}</TableCell>
                           </TableRow>
                        </TableHead>
                     </Table>
                     <Typography fontStyle={'italic'} my={3}>Early Payment Will Be Appreciated </Typography>
                  </Box>
               </Box>
            </>
         }
      </Box>
   )
}

export default Statements