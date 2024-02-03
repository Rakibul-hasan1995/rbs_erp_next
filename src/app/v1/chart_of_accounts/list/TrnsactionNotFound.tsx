import { Box, Typography } from "@mui/material"
import Image from "next/image"
import searchImg from '@/v1/assets/img/search.png'

export const TransactionNotFound = () => {
   return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexWrap: 'wrap' }}>
         <Box textAlign={"center"} >
            <Image
               style={{ display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: 20 }}
               src={searchImg}
               width={50}
               height={50}
               alt="Picture of the author"
            />
            <Typography variant='caption'>There are no transaction available</Typography>
         </Box>
      </Box>
   )
}