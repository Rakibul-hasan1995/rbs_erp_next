'use client'
import { ColDef } from 'ag-grid-community';
import * as React from 'react'
import toast from 'react-hot-toast';
import { RenderCurrency, RenderDate, RenderImage, RenderQty } from '@/v1/components/table/cell';
import { Pagination } from '@/v1/components/table/paginationBar';
import { Axios } from '@/v1/utils/axios-config';
import UiTable from '@/v1/components/table/uiTable';
import useConfig from '@/v1/hooks/useConfig';
import { Box, Fab, IconButton } from '@mui/material';
import { BsEye } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';


const ListOrders = () => {
   const { config } = useConfig()




   const colDef: ColDef[] = [
      {
         field: "order_date",
         headerName: "Date",
         filter: true,
         cellRenderer: RenderDate,
         editable: true
      },
      {
         field: "program_name",
         headerName: "Program-no",
         filter: true,
         editable: true
      },
      {
         field: "order_name",
         headerName: "Order-no",
         filter: true,
         editable: true
      },
      {
         field: "qty",
         headerName: "Qty",
         filter: true,
         editable: true,
         cellRenderer: RenderQty,
      },
      {
         field: "rate",
         headerName: "Rate",
         filter: true,
         editable: true,
         cellClass: 'justify-end',
         cellRenderer: RenderCurrency,
      },
      {
         field: "cover_photo.href",
         headerName: "Design",
         filter: true,
         editable: true,
         // cellClass: 'justify-ce',
         cellRenderer: RenderImage,
      },
      {
         field: "status",
         headerName: "Status",
         filter: true,
         cellClass: (params: { value: any }) => `status-${params.value}`,
         cellStyle: { justifyContent: "center" },
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
                  <Link href={'#'} passHref legacyBehavior>
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
         const { data } = await Axios.get(`/api/v1/orders?limit=${pagination.limit}&${str}&filter_key=status&filter_value=Invoiced`)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
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
      <div className="relative">
         {/* {orderState.loading && <LoadingSpin />} */}
         <UiTable
            colDef={colDef}
            rowData={rowData}
            paginationInfo={pagination}
            fetch={fetch}
            setPaginationInfo={setPagination}
            // loading={orderState.loading}
            onCellValueChanged={handleUpdateOrder}
         />
         <Box position={'absolute'} bottom={55} right={20} zIndex={200}>
            <Link href={'/v1/orders/add'}>
               <Fab color='info' size='small'>
                  <FaPlus />
               </Fab>
            </Link>
         </Box>
      </div>
   )
}


export default ListOrders
