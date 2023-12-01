'use client'
import { ColDef } from 'ag-grid-community';


import * as React from 'react'

import toast from 'react-hot-toast';
import { RenderCurrency, RenderDate, RenderImage, RenderNumber, RenderQty } from '@/v1/components/table/cell';
import { Pagination } from '@/v1/components/table/paginationBar';
import { Axios } from '@/v1/utils/axios-config';
import UiTable from '@/v1/components/table/uiTable';
import useConfig from '@/v1/hooks/useConfig';
import { Box, Fab, IconButton } from '@mui/material';
import { BsEye } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';


const ListInvoices = () => {
   const { config } = useConfig()




   const colDef: ColDef[] = [
      {
         field: "date",
         headerName: "Date",
         filter: true,
         cellRenderer: RenderDate,
         editable: true,
         // cellEditor: DateEditor,
         cellEditorPopup: true
      },
      {
         field: "customer.user_name",
         headerName: "Customer",
         filter: true,
         editable: false,
         cellRenderer: (params: any) => {
            return (
               <Link href={`/v1/customers/profile/${params.data.customer._id}`} passHref legacyBehavior>
                  <span className='link-text'>{params.value}</span>
               </Link>
            )
         }
      },
      {
         field: "invoice_no",
         headerName: "Invoice-no",
         cellClass: 'justify-center',
         filter: true,
         editable: false,
         cellStyle: { textAlign: "center" },

      },
      {
         field: "amount",
         headerName: "Amount",
         filter: true,
         editable: true,
         cellStyle: { textAlign: "right" },

         cellRenderer: RenderNumber,
      },
      {
         field: "cover_photo.href",
         headerName: "Design",
         filter: true,
         editable: true,
         cellStyle: { textAlign: "center" },
         cellRenderer: RenderImage,
      },
      {
         field: "status",
         headerName: "Status",
         filter: true,
         cellClass: (params: { value: any }) => `status-${params.value}`,
         cellStyle: { textAlign: "center" },
         editable: true,
         cellEditor: "agSelectCellEditor",
         maxWidth: 150,
         // sort: "desc",
         cellEditorParams: {
            values: config?.invoice_status?.map((item: any) => { return item })
         },
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Link href={`/v1/invoices/view/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
                     </IconButton>
                  </Link>
                  <Link href={`/v1/invoices/update/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='warning'>
                        <TbEdit />
                     </IconButton>
                  </Link>
               </Box>
            )
         }
      }
   ]


   const [rowData, setRowData] = React.useState([])
   const [pagination, setPagination] = React.useState<Pagination>({
      nextPage: null,
      prevPage: null,
      currentPage: 1,
      totalPages: 0,
      totalDocuments: 0,
      limit: 25
   },)

   React.useEffect(() => {
      fetch(`page=${1}`)
   }, [])






   const fetch = async (str: string) => {
      try {
         const { data } = await Axios.get(`/api/v1/invoices?limit=${pagination.limit}&${str}`)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }



   const handleUpdateInvoice = async (api: any) => {
      try {
         const field = api.column.colId
         const value = api.value
         const obj = { [field]: value }
         const id = api.data._id

         const { data } = await Axios.put(`api/v1/invoices/${id}`, obj)

         if (data.code == 200) {
            toast.success(`successfully update invoice (${data.data.invoice_no}) ${field}`)
         }
      } catch (error) {
         console.log(error)
         toast.error(`error in update invoice`)
      }
   }



   return (
      <div className="relative">
         {/* {orderState.loading && <LoadingSpin />} */}
         <UiTable
            colDef={colDef}
            rowData={rowData}
            paginationInfo={pagination}
            fetch={fetch}
            setPaginationInfo={setPagination}
            // loading={orderState.loading}
            onCellValueChanged={handleUpdateInvoice}
         />
         <Box position={'absolute'} bottom={55} right={20} zIndex={200}>
            <Link href={'/v1/invoices/add'}>
               <Fab color='info' size='small'>
                  <FaPlus />
               </Fab>
            </Link>
         </Box>
      </div>
   )
}


export default ListInvoices
