'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { Axios } from '@/v1/utils/axios-config';
import { InvoiceExpand, PurchaseOrderInvoiceExpand } from '@/v1/utils/Types';
import ViewInvoice from '@/app/v1/invoices/view/[_id]/ViewInvoice';
import LoadingInvoice from '@/v1/components/loading/LoadingInvoice';
import { Box, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
import { BiSolidDashboard } from 'react-icons/bi';
import { FaLayerGroup, FaFileInvoiceDollar } from 'react-icons/fa';
import { MdLayers } from 'react-icons/md';
import { Link as MUILink } from '@mui/material';

export default function SubPage() {

   const activePage = useParams();
   const id = activePage.id || "";
   const [invoice, setInvoice] = useState<InvoiceExpand>()
   const fetchData = async () => {
      try {
         const { data } = await Axios.get(`/api/v1/purchase-order-invoices/${id}`)
         const inv: PurchaseOrderInvoiceExpand = data.data
         const obj: InvoiceExpand = {
            ...inv,
            customer: inv.supplier,
            customer_bill_no: inv.supplier_bill_no
         }
         setInvoice(obj)
      } catch (error) {
         console.log(error)
      }
   }
   useEffect(() => {
      fetchData()
   }, [])

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
               {/* <MUILink component={Link} href={`/v1/orders/profile/${id}`} underline='hover' color={'inherit'} sx={{ display: 'flex', alignItems: 'center' }} >
                  <MdLayers style={{ marginRight: '5px' }} />
                  {invoice ? `${order?.program_name} ${order?.order_name}` : 'loading...'}
               </MUILink> */}
               <MUILink component={Link} href={`#`} underline='hover' sx={{ display: 'flex', alignItems: 'center' }}  >
                  <Box mr={1}>
                     <FaFileInvoiceDollar />
                  </Box>
                  Invoice
               </MUILink>

            </Breadcrumbs>
         </Box>
         {invoice ? <ViewInvoice data={invoice} /> : <LoadingInvoice />}
      </>
   )
}
