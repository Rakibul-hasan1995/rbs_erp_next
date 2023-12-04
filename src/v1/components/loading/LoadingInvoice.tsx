import { Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Skeleton } from "@mui/material"



const LoadingInvoice = () => {
   return (
      <Box component={Paper} width={'220mm'} height={'290mm'} mx={'auto'} sx={{ color: 'black' }} position={'relative'} pt={2} bgcolor={'white'}>
         <img src="https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png" width={'100%'} />
         <Box p={8} >
            <Box display={'flex'} justifyContent={'space-between'} mb={3}>
               <div>
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={30} />
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={150} />
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={230} />

               </div>
               <div>
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={80} />
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={150} />
                  <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={230} />
               </div>
            </Box>
            <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="text" width={150} />

            <Table size="small" sx={{ color: 'black', textEmphasisColor: 'black', mt: 2 }} >
               <TableHead>
                  <TableRow>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '25%', color: 'black', fontWeight: 'bold' }}>Style</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '5%', color: 'black', fontWeight: 'bold' }}>Design</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '20%', color: 'black', fontWeight: 'bold' }}>CH-No</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Qty</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Rate</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Total(usd)</TableCell>
                     <TableCell align="center" sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}>Total(BDT)</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  <TableRow >
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="rectangular" width={70} height={40} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                  </TableRow>
                  <TableRow >
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="rectangular" width={70} height={40} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                  </TableRow>
                  <TableRow >
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant="rectangular" width={70} height={40} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black' }}>
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                  </TableRow>

               </TableBody>
               <TableHead>
                  <TableRow>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="center" colSpan={3}>Total</TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="center">
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }}> </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="right">
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                     <TableCell sx={{ border: 1, borderColor: 'darkgrey', width: '14.28%', color: 'black', fontWeight: 'bold' }} align="right">
                        <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={50} />
                     </TableCell>
                  </TableRow>
               </TableHead>
            </Table>
            <br />
            <Skeleton sx={{ color: 'lightgray', backgroundColor: 'lightgray' }} variant='text' width={300} />

            <Typography fontStyle={'italic'} my={3}>Early Payment Will Be Appreciated </Typography>
            <Typography fontStyle={'italic'} my={2}>Thanks</Typography>
            <Box p={3} display={'flex'} justifyContent={'space-between'}>
               <Typography fontStyle={'oblique'}> <u>Received By</u> </Typography>
               <Typography fontStyle={'oblique'}><u>For: Monapy Embroidery</u></Typography>
            </Box>


         </Box>
         <Box position={'absolute'} bottom={40} width={'100%'}>
            <Typography textAlign={'center'}>A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420</Typography>
         </Box>
      </Box>
   )
}

export default LoadingInvoice