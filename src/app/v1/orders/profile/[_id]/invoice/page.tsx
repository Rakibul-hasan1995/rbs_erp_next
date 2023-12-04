
'use client';
import ViewInvoice from '@/app/v1/invoices/view/[_id]/ViewInvoice';
import { InvoiceExpand, Order } from '@/v1/utils/Types'
import { Axios } from '@/v1/utils/axios-config'
import { Breadcrumbs, Box } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import * as React from 'react'
import { BiSolidDashboard } from 'react-icons/bi';
import { FaFileInvoiceDollar, FaLayerGroup } from 'react-icons/fa';
import { MdLayers } from 'react-icons/md';
import { Link as MUILink } from '@mui/material';
import { useThemeContext } from '@/v1/context/themeContext';
import LoadingInvoice from '@/v1/components/loading/LoadingInvoice';

export default function Page() {
   const activePage = useParams()
   const id = activePage._id
   const [data, setData] = React.useState<InvoiceExpand>()
   const [order, setOrder] = React.useState<Order>()


   React.useEffect(() => {
      fetchInvoice()
   }, [])
   const { setTitle } = useThemeContext()
   React.useEffect(() => {
      if (order) {
         setTitle(`${order?.program_name} ${order?.order_name} > Invoice`)
      }
      return ()=>{
         setTitle("RBS")
      }
   }, [order])

   const fetchInvoice = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/orders/${id}/invoice`)
         const { data: orderData } = await Axios.get(`/api/v1/orders/${id}`)
         setData(data.data)
         setOrder(orderData.data)
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <>
         <Box bgcolor={'transparent'} position={'sticky'} top={70} mb={2} zIndex={2}>
            <Breadcrumbs aria-label="breadcrumb">
               <MUILink component={Link} href="/v1/dashboard" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }}>
                  <BiSolidDashboard style={{ marginRight: '5px' }} />
                  Dashboard
               </MUILink>
               <MUILink component={Link} href="/v1/orders" underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }} >
                  <FaLayerGroup style={{ marginRight: '5px' }} />
                  Orders
               </MUILink>
               <MUILink component={Link} href={`/v1/orders/profile/${id}`} underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }} >
                  <MdLayers style={{ marginRight: '5px' }} />
                  {order ? `${order?.program_name} ${order?.order_name}` : 'loading...'}
               </MUILink>
               <MUILink component={Link} href={`#`} underline='hover' sx={{ display: 'flex', alignItems: 'center' }}  >
                  <Box mr={1}>
                     <FaFileInvoiceDollar />
                  </Box>
                  Invoice
               </MUILink>

            </Breadcrumbs>
         </Box>
         {data ? <ViewInvoice data={data} /> : <LoadingInvoice />}
      </>
   )
}
