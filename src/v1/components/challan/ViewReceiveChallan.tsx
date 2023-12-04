
import {
   Box,
   Divider,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography,
} from "@mui/material";
import { Challan } from "@/v1/utils/Types";
import moment from "moment";

const ViewChallan = ({ data, title }: { data?: Challan, title: string }) => {


   return (
      <Box sx={{ userSelect: 'none' }}>
         {data &&
            <>
               <Box component={Paper} width={'220mm'} height={'290mm'} mx={'auto'} sx={{ color: 'black' }} position={'relative'} pt={2} bgcolor={'white'}>
                  <img src="https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png" width={'100%'} />
                  <Typography mt={2} component={Paper} bgcolor={'white'} color={'black'} align="center" fontSize={20}>{title}</Typography>
                  <Box p={8} >
                     <Box display={'flex'} justifyContent={'space-between'} mb={3}>
                        <Box maxWidth={270}>
                           <Typography >Challan No: {data.challan_no}</Typography>
                           <Typography fontWeight={'bold'}> Factory Name : {data?.customer.user_name}.</Typography>
                           <Typography > Address : {data?.customer.contact_details.address}.</Typography>
                        </Box>
                        <Box maxWidth={200}>
                           <Typography>Date : {moment(data?.date).format('DD-MMM-YY')}</Typography>
                           <Typography>Order No   : <strong>{data?.items?.[0].order.order_name}</strong></Typography>
                           <Typography>Buyer Name: </Typography>
                        </Box>
                     </Box>
                     <Divider sx={{ my: 2, borderColor: "black" }} />
                     <Table size="small" sx={{ color: 'black', textEmphasisColor: 'black' }} >
                        <TableHead>
                           <TableRow>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '200px', color: 'black', fontWeight: 'bold' }}>Order</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>Design</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>Qty</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>E.R</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>F.R</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>Remarks</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {data?.items?.map((item) => (
                              <TableRow key={item.order._id} >
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black' }}>{item.order.program_name} {item.order.order_name}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}> <img src={item.order.cover_photo.href} width={70} height={40} alt="" /> </TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black' }}>{item.qty}</TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black' }}>{item.emb_reject_qty}</TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black' }}>{item.fabric_reject_qty}</TableCell>
                                 <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black' }}>{item.remarks}</TableCell>
                              </TableRow>
                           ))}
                           <TableRow>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }} colSpan={2}>Total</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>{data.total?.qty}</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>{data.total?.emb_reject_qty}</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}>{data.total?.fabric_reject_qty}</TableCell>
                              <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', color: 'black', fontWeight: 'bold' }}></TableCell>
                           </TableRow>
                        </TableBody>

                     </Table>
                  </Box>
                  <Box position={'absolute'} bottom={40} width={'100%'}>
                     <Typography textAlign={'center'}>A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420</Typography>
                  </Box>
               </Box>
            </>
         }
      </Box>
   )
}

export default ViewChallan