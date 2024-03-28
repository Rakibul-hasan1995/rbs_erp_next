'use client'
import { ColDef } from 'ag-grid-community';
import * as React from 'react'
import { RenderCurrency, RenderImage, RenderOrderProgress, RenderQty } from '@/v1/components/table/cell';
import UiTable from '@/v1/components/table/uiTable';
import useConfig from '@/v1/hooks/useConfig';
import { Box, Fab, IconButton } from '@mui/material';
import { BsEye } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { useThemeContext } from '@/v1/context/themeContext';
import useOrderSocket from '@/v1/components/orders/useOrderSocket';
import { useParams } from 'next/navigation';



const ReportsOrder = () => {
   const activePage = useParams()
   const page = activePage.page
   const { config } = useConfig()

   const colDef: ColDef[] = [
      {
         field: "customer.user_name",
         headerName: "Customer",
         filter: true,
         // editable: false,
         minWidth: 150,
         editable: true,
         // cellEditor: CustomerEditor,
         cellEditorPopup: true,
         cellRenderer: (params: any) => {
            return (
               <Link href={`/v1/customers/profile/${params.data.customer._id}`} passHref legacyBehavior>
                  <span className='link-text'>{params.value}</span>
               </Link>
            )
         }
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
         sortable: false,
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

   const { fetch, rowData, pagination, setPagination, handleUpdateOrder } =
      useOrderSocket(`&page=${page}&filter_key=status&filter_value=Invoiced&expand=true`)

   const { setTitle } = useThemeContext()
   React.useEffect(() => {
      fetch(``)
      setTitle('Orders')
      return () => { setTitle('RBS') }
   }, [])


   const fetchData = async (str: string) => {
      fetch(`${str}`)
   }


   return (
      <div className="relative">
         {/* {orderState.loading && <LoadingSpin />} */}
         <UiTable
            colDef={colDef}
            rowData={rowData}
            paginationInfo={pagination}
            fetch={fetchData}
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


export default ReportsOrder
