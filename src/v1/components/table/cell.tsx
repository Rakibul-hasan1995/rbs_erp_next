import { numberWithCommas } from "@/v1/utils/numberFormater"
import { Box } from "@mui/material";
import moment from "moment"
import Image from "next/image"
import CircularWithValueLabel from "../progressBar/CircularProgressBar"

export const RenderDate = (params: any) => {
   return <>{moment(params.value).format('yyyy-MM-DD')}</>
}
export const RenderQty = (params: any) => {
   return <>{`${params.value} ${params.data.unit}`}</>
}
export const RenderCurrency = (params: any) => {
   return <>{`${params.data.currency} ${numberWithCommas(params.value)}`}</>
}
export const RenderNumber = (params: any) => {
   return <>{`${numberWithCommas(params.value)}`}</>
}
export const RenderImage = (params: any) => {
   return <Image loading="lazy" width={70} height={40} src={params.value} alt="img" style={{ borderRadius: 5 }} />
}
export const RenderOrderProgress = (params: any) => {
   const percent = +params.value / params.data.qty * 100


   let color: "success" | "error" | "info" | "primary" | "warning" = 'error'
   if (percent > 10) {
      color = 'error'
   }
   if (percent > 40) {
      color = 'primary'
   }
   if (percent > 60) {
      color = 'info'
   }
   if (percent > 95) {
      color = 'success'
   }
   if (percent > 105) {
      color = 'warning'
   }

   return (
      <Box sx={{ display: 'flex', justifyContent: 'space-around', py: '2px'}}>
         {/* <Typography textAlign={'center'} variant="body2">{`${params.value}`}</Typography>
         <Tooltip title={`${percent.toFixed(2)} %`}>
            <LinearProgress color={`${color}`} variant="determinate" value={percent} />
         </Tooltip> */}
         <CircularWithValueLabel value={percent} color={`${color}`} />
         {`${params.value}`}
      </Box>

   )
}
