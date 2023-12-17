import CircularProgressBar from '@/v1/components/progressBar/CircularProgressBar'
import { OrderExpand } from '@/v1/utils/Types'
import { numberWithCommas } from '@/v1/utils/numberFormater'
import { Box, ButtonBase, Card, CardContent, Grid, Paper, Skeleton, Tooltip, Typography } from '@mui/material';
import Link from 'next/link'
import { MdPriceCheck } from 'react-icons/md'
import { PiPlusMinusFill } from "react-icons/pi";
import { GiSewingNeedle } from "react-icons/gi";


export default function OrderDetails({ order }: { order: OrderExpand }) {

  const qty = order?.qty || 0
  const receiveQty = order?.receive_qty || 0
  const deliveryQty = order?.delivery_qty || 0
  const receivableQty = qty - receiveQty || 0
  const deliverableQty = qty - deliveryQty || 0
  const productionQty = order?.production_qty || 0

  const receiveLink = receiveQty > 0 ? `/v1/orders/profile/${order._id}/receive` : undefined
  const deliveryLink = deliveryQty > 0 ? `/v1/orders/profile/${order._id}/delivery` : undefined
  const invoiceLink = order.status == 'Invoiced' ? `/v1/orders/profile/${order._id}/invoice` : undefined
  const productionLink = receiveQty > 0 ? `/v1/orders/profile/${order._id}/receive` : undefined
  let info: CardProps[] = [
    {
      value: `${order.qty}`,
      title: 'Qty',
      progress: 100,
      Icon: PiPlusMinusFill
    },
    {
      value: `${order.currency} ${numberWithCommas(order.rate)}`,
      title: 'Rate',
      progress: 100,
      Icon: MdPriceCheck
    },
    {
      value: `${order.stitching}`,
      title: 'Stitch',
      progress: 100,
      Icon: GiSewingNeedle
    },
    {
      value: `${receiveQty}`,
      title: 'Receive Qty',
      progress: receiveQty / qty * 100,
      link: receiveLink
    },
    {
      value: `${receivableQty}`,
      title: 'Receivable Qty',
      progress: receivableQty / qty * 100,
      // link: receiveLink
    },
    {
      value: `${productionQty}`,
      title: 'Production Qty',
      progress: productionQty / qty * 100,
      // link: productionLink
    },
    {
      value: `${deliveryQty}`,
      title: 'Delivery Qty',
      progress: deliveryQty / qty * 100,
      link: deliveryLink
    },
    {
      value: `${deliveryQty}`,
      title: 'Deliverable Qty',
      progress: deliverableQty / qty * 100,
      // link: receiveLink
    },

  ]


  const calculateInvoiceAmount = () => {

    if (!order) {
      return 0
    }
    const exchange_rate = +order?.customer?.exchange_rate || 85
    const rate = order?.currency == 'BDT' ? order.rate : (exchange_rate * order.rate / 12)

    const amm = `${(rate * order.qty)}`
    return numberWithCommas(+amm)
  }



  if (order.status == 'Invoiced') {
    info.push({
      title: 'Invoice Amount', progress: 100, link: invoiceLink,
      value: `${calculateInvoiceAmount()}`
    })
  }


  return (
    <Box mx={'auto'} maxWidth={'70rem'}>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <Grid container>
            {info.map((item) => (
              <Grid key={item.title} item p={1} xs={12} sm={6} md={4} > <InfoCard data={item} /> </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <img src={order.cover_photo.href} alt="img" width={'100%'} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


interface CardProps {
  title: string;
  value: string;
  progress: number;
  link?: string;
  Icon?: any;
}

const getColor = (value: number = 0) => {
  let color: "success" | "error" | "info" | "primary" | "warning" = 'error'
  if (value > 10) {
    color = 'error'
  }
  if (value > 40) {
    color = 'primary'
  }
  if (value > 60) {
    color = 'info'
  }
  if (value > 95) {
    color = 'success'
  }
  if (value > 105) {
    color = 'warning'
  }
  return color
}




const InfoCard = ({ data }: { data: CardProps }) => {
  const { title, value, progress, link, Icon } = data
  return (
    <ButtonBase sx={{ width: '100%' }}  >
      <Box width={'100%'} component={Paper} p={2} justifyContent={'space-between'} display={'flex'} alignItems={'center'}>
        <Box >
          <CircularProgressBar color={getColor(progress)} size={50} value={progress} />
        </Box>
        <Box textAlign={'center'} >
          <Box gap={1} display={Icon ? 'flex' : "block"} sx={{ alignItems: 'center' }}>
            {Icon && <Icon />}
            <Typography variant='body2'>{title}</Typography>
          </Box>

          {link ?
            <Link href={link} legacyBehavior>
              <Tooltip title={`Go to Link`} arrow>
                <Typography color={'salmon'} className='link-text' fontWeight={'800'} variant='h6'>{value}</Typography>
              </Tooltip>
            </Link>
            : <Typography color={'cyan'} fontWeight={'800'} variant='h6'>{value}</Typography>}
        </Box>
      </Box>
    </ButtonBase>

  )
}


let info = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const OrderDetailsLoadingUi = () => {
  return (
    <Box mx={'auto'} maxWidth={'70rem'}>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <Grid container>
            {info.map((item) => (
              <Grid key={item} item p={1} xs={12} sm={6} md={4} >
                <Box width={'100%'} component={Paper} p={2} justifyContent={'space-between'} display={'flex'} alignItems={'center'}>
                  <Box >
                    {/* <CircularProgressBar color={getColor(progress)} size={50} value={progress} /> */}
                    <Skeleton variant='circular' width={50} height={50} />
                  </Box>
                  <Box textAlign={'center'} >
                    <Box gap={1} sx={{ alignItems: 'center' }}>
                      <Skeleton width={100} />
                    </Box>
                    <Skeleton variant='text' width={70} sx={{ fontSize: '24px' }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid component={Card} item xs={12} sm={4}>
          <CardContent>
            <Skeleton sx={{ width: '100%', height: '12rem' }} />
          </CardContent>
        </Grid>
      </Grid>
    </Box>
  )
}

