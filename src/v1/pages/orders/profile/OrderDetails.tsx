import CircularProgressBar from '@/v1/components/progressBar/CircularProgressBar'
import { OrderExpand } from '@/v1/utils/Types'
import { numberWithCommas } from '@/v1/utils/numberFormater'
import { Box, ButtonBase, Card, Divider, Grid, Paper, Tooltip, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { FaLayerGroup } from 'react-icons/fa'
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
  const productionLink = receiveQty > 0 ? `/v1/orders/profile/${order._id}/receive` : undefined
  const info: CardProps[] = [
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
      link: receiveLink
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
      // link: receiveLink
    },
    {
      value: `${deliveryQty}`,
      title: 'Deliverable Qty',
      progress: deliverableQty / qty * 100,
      // link: receiveLink
    },

  ]




  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <Grid container>
            {info.map((item) => (
              <Grid key={item.title} item p={1} xs={12} sm={6} md={4} > <InfoCard data={item} /> </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}></Grid>
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
          <Box gap={1} display={ Icon ? 'flex': "block"} sx={{ alignItems: 'center' }}>
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