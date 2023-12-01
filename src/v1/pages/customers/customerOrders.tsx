'use client';
import { ColDef } from 'ag-grid-community';
import * as React from 'react'
import { RenderCurrency, RenderDate, RenderImage, RenderOrderProgress, RenderQty } from '@/v1/components/table/cell';
import UiTable from '@/v1/components/table/uiTable';
import useConfig from '@/v1/hooks/useConfig';
import { Box, IconButton } from '@mui/material';
import { BsEye } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Pagination } from '@/v1/components/table/paginationBar';
import { Axios } from '@/v1/utils/axios-config';
import toast from 'react-hot-toast';



const CustomerOrders = () => {
   const { config } = useConfig()

   const colDef: ColDef[] = [
      {
         field: "order_date",
         headerName: "Date",
         filter: true,

         minWidth: 120,
         editable: true,
         cellRenderer: RenderDate,
         cellEditorPopup: true,

      },
      {
         field: "order_name",
         headerName: "Order-no",
         filter: true,
         editable: true
      },
      {
         field: "program_name",
         headerName: "Program-no",
         filter: true,
         editable: false
      },

      {
         field: "qty",
         headerName: "Qty",
         filter: false,
         editable: true,
         cellRenderer: RenderQty,
      },
      {
         field: "receive_qty",
         headerName: "Rec Qty",
         filter: false,
         editable: false,
         cellRenderer: RenderOrderProgress,
      },
      {
         field: "production_qty",
         headerName: "Production Qty",
         filter: false,
         editable: false,
         cellRenderer: RenderOrderProgress,
      },
      {
         field: "delivery_qty",
         headerName: "Del Qty",
         filter: false,
         editable: false,
         cellRenderer: RenderOrderProgress
      },

      {
         field: "rate",
         headerName: "Rate",
         filter: false,
         editable: true,
         cellClass: 'justify-end',
         cellRenderer: RenderCurrency,

      },
      {
         field: "cover_photo.href",
         headerName: "Design",
         filter: false,

         editable: true,
         cellStyle: { display: 'block' },

         cellRenderer: RenderImage,
      },

      {
         field: "status",
         headerName: "Status",

         filter: true,
         cellClass: (params: { value: any }) => `status-${params.value}`,
         cellStyle: { textAlign: 'center' },
         editable: true,
         maxWidth: 150,
         sort: "desc",
         cellEditor: "agSelectCellEditor",
         cellEditorParams: {
            values: config?.orderStatus?.map((item: any) => { return item })
         },
      },

      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>

                  <Link href={`/v1/orders/profile/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
                     </IconButton>
                  </Link>
                  <Link href={`/v1/orders/update/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='warning'>
                        <TbEdit />
                     </IconButton>
                  </Link>
               </Box>
            )
         }
      }
   ]


   React.useEffect(() => {
      fetch(``)
   }, [])

   const activePage = useParams()
   const id = activePage._id

   const [data, setData] = React.useState([])
   const [pagination, setPagination] = React.useState<Pagination>({
      nextPage: null,
      prevPage: null,
      currentPage: 1,
      totalPages: 0,
      totalDocuments: 0,
      limit: 25
   },)
   React.useEffect(() => {
      fetch(' ')
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const fetch = async (payload: any) => {
      try {
         const { data } = await Axios.get(`/api/v1/users/${id}/orders?limit=${pagination.limit}&${payload}&expand=true`)
         setData(data.data)
         setPagination((prev) => ({ ...prev, ...data.pagination }))
      } catch (error) {
         console.log(error)
      }

   }




   const fetchData = async (str: string) => {
      fetch(`${str}`)
   }

   const handleUpdateOrder = async (api: any) => {
      try {
         const field = api.column.colId
         const value = api.value

         const obj = { [field]: value }
         const id = api.data._id

         const { data } = await Axios.put(`api/v1/orders/${id}`, obj)

         if (data.code == 200) {
            toast.success(`successfully update ${data.data.order_name} - ${field}`)
         }
      } catch (error) {
         console.log(error)
         toast.error(`error in update invoice`)
      }
   }
   return (
      <div>
         {/* {orderState.loading && <LoadingSpin />} */}
         <UiTable
            colDef={colDef}
            rowData={data}
            paginationInfo={pagination}
            fetch={fetchData}
            setPaginationInfo={setPagination}
            // loading={orderState.loading}
            onCellValueChanged={handleUpdateOrder}
         />

      </div>
   )
}


export default CustomerOrders
