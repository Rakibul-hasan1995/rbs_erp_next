
'use client';;
import { useThemeContext } from '@/v1/context/themeContext';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OrderDetails, { OrderDetailsLoadingUi } from './OrderDetails';
import { OrderExpand } from '@/v1/utils/Types';
import { Axios } from '@/v1/utils/axios-config';
import { Breadcrumbs, ButtonGroup } from '@mui/material';
import Link from 'next/link';
import { Link as MUILink } from '@mui/material';
import { FaLayerGroup } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';
import CloneDialog from './clone';
import DeleteDialog from './delete';


export default function OrderProfile() {

   const activePage = useParams()
   const id = activePage._id
   const { setTitle } = useThemeContext()

   const [order, setOrder] = React.useState<OrderExpand>()

   const fetch = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/orders/${id}?expand=true`)
         setOrder(data.data)
         console.log(data)
      } catch (error) {
         console.log(error)
      }
   }
   React.useEffect(() => {
      fetch()
   }, [])
   React.useEffect(() => {
      if (order) {
         setTitle(`${order.program_name} ${order.order_name}`)
      }
      return () => {
         setTitle('RBS')
      }
   }, [order])

   return (
      <Box position={'relative'}>
         <Breadcrumbs aria-label="breadcrumb">
            <MUILink component={Link} href="/v1/dashboard" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }}>
               <BiSolidDashboard style={{ marginRight: '5px' }} />
               Dashboard
            </MUILink>
            <MUILink component={Link} href="/v1/orders" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }} >
               <FaLayerGroup style={{ marginRight: '5px' }} />
               Orders
            </MUILink>
            <MUILink component={Link} href="#" underline='hover' >
               {order ? `${order?.program_name} ${order?.order_name}` : 'loading...'}
            </MUILink>
         </Breadcrumbs>
         {order ? <OrderDetails order={order} /> : <OrderDetailsLoadingUi />}
         <Box right={0} top={200} position={'absolute'}>
            <ButtonGroup size="medium" aria-label="small button group" variant='contained' orientation='vertical'>
               {order && <CloneDialog order={order} />}
               {order && <DeleteDialog order={order} />}
            </ButtonGroup>
         </Box>
      </Box>
   );
}

