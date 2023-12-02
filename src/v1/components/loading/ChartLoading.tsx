import { Box, Paper, Skeleton } from "@mui/material"


const ChartLoading = () => {
   return (
      <Box width={'100%'} height={315} component={Paper} p={3} display={'flex'} justifyContent={'space-evenly'} alignItems={'baseline'}>
         <Skeleton variant='rounded' width={'5%'} height={'50%'} />
         <Skeleton variant='rounded' width={'5%'} height={'100%'} />
         <Skeleton variant='rounded' width={'5%'} height={'80%'} />
         <Skeleton variant='rounded' width={'5%'} height={'70%'} />
         <Skeleton variant='rounded' width={'5%'} height={'60%'} />
         <Skeleton variant='rounded' width={'5%'} height={'100%'} />
         <Skeleton variant='rounded' width={'5%'} height={'80%'} />
         <Skeleton variant='rounded' width={'5%'} height={'65%'} />
         <Skeleton variant='rounded' width={'5%'} height={'80%'} />
         <Skeleton variant='rounded' width={'5%'} height={'100%'} />
         <Skeleton variant='rounded' width={'5%'} height={'90%'} />
         <Skeleton variant='rounded' width={'5%'} height={'50%'} />
         <Skeleton variant='rounded' width={'5%'} height={'100%'} />
      </Box>
   )
}
export default ChartLoading