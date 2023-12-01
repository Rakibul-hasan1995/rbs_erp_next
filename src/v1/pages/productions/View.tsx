
'use client'
import { useEffect, useState } from 'react';
import { Axios } from '../../utils/axios-config';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import { ProductionExpanded } from '@/v1/utils/Types';
import Image from 'next/image';
import { numberWithCommas } from '@/v1/utils/numberFormater';
import moment from 'moment';

const DetailsProduction = () => {
   const [pData, setData] = useState<ProductionExpanded>()
   useEffect(() => {
      fetchData()

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const activePage = useParams()
   const _id = activePage._id
   const fetchData = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/productions/${_id}?expand=true`)
         setData(data.data)
         console.log(data)
      } catch (error) {
         console.log(error)
      }
   }


   return (
      <Container>
         <Box>
            <Grid container>
               <Grid item xs={12} sm={8}>
                  <Box p={2} component={Paper}>
                     <Typography>Date: {moment(pData?.date).format('DD-MMM-YY')}</Typography>
                     <Typography>Shift: {pData?.shift}</Typography>
                     <Table size='small'>
                        <TableHead>
                           <TableRow>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>MC_No</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Order No</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Design</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Qty</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Rate</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Amount</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Operator</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>Remarks</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {pData?.production_data?.map((item) => (
                              <TableRow key={item._id}>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{item.machine_no}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{`${item.order?.program_name} ${item.order.order_name}`}</TableCell>
                                 <TableCell sx={{ p: 0.5, border: 1, borderColor: 'darkgrey' }}>
                                    <Image style={{ borderRadius: '10%' }} src={item.order.cover_photo.href} width={70} height={50} alt={'item'} />
                                 </TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{item.qty}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{item.order.rate}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{numberWithCommas(+item.qty * +item.order.rate)}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{item?.operator?.user_name}</TableCell>
                                 <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}>{item.remarks}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                        <TableHead>
                           <TableRow>
                              <TableCell align='center' colSpan={5} sx={{ border: 1, borderColor: 'darkgrey' }}>Total</TableCell>
                              <TableCell sx={{ border: 1, borderColor: 'darkgrey' }}> <strong>{numberWithCommas(pData?.total_amount)}</strong> </TableCell>
                              <TableCell colSpan={2} sx={{ border: 1, borderColor: 'darkgrey' }}></TableCell>
                           </TableRow>
                        </TableHead>
                     </Table>
                  </Box>
               </Grid>
            </Grid>
         </Box>
      </Container>
   )
}


export default DetailsProduction

