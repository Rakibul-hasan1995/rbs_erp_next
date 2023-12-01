'use client'
import { RenderDate, RenderNumber } from '@/v1/components/table/cell'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import { useThemeContext } from '@/v1/context/themeContext'
import { Axios } from '@/v1/utils/axios-config'
import { Box, Fab, IconButton } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import * as React from 'react'
import { BsEye } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { TbEdit } from 'react-icons/tb'




const ListPayments = () => {



   const colDef: ColDef[] = [
      {
         field: "date",
         headerName: "Date",
         filter: true,
         cellRenderer: RenderDate,
         editable: false,
         // cellEditor: DateEditor,

         cellEditorPopup: true
      },
      {
         field: "customer.user_name",
         headerName: "Customer",
         filter: true,
         editable: false
      },
      {
         field: "receipt_no",
         headerName: "MRC No",
         filter: true,
         editable: false,
         cellStyle: { display: 'flex', justifyContent: 'center' },

      },

      {
         field: "payment_mode",
         headerName: "Payment Mode",
         filter: false,
         editable: false,
         cellStyle: { display: 'flex', justifyContent: 'center' },
      },
      {
         field: "amount",
         headerName: "Amount",
         filter: false,
         editable: false,
         cellStyle: { display: 'flex', justifyContent: 'center' },
         cellRenderer: RenderNumber,
      },
      {
         field: "description",
         headerName: "description",
         filter: false,
         editable: true,
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellClass: 'justify-center',
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>

                  <Link href={`/v1/payments/view/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
                     </IconButton>
                  </Link>
                  <Link href={`/v1/payments/update/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='warning'>
                        <TbEdit />
                     </IconButton>
                  </Link>
               </Box>
            )
         }
      },
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


   const { setTitle } = useThemeContext()

   React.useEffect(() => {
      fetch(`page=${1}`)
      setTitle('Payments')
      return () => {
         setTitle("RBS")
      }
   }, [])






   const fetch = async (str: string) => {
      try {
         const { data } = await Axios.get(`/api/v1/payments?limit=${pagination.limit}&${str}`)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <>
         <UiTable
            colDef={colDef}
            rowData={rowData}
            paginationInfo={pagination}
            fetch={fetch}
            setPaginationInfo={setPagination}
         // loading={true}
         // onCellValueChanged={(x) => console.log(x.data)}

         />
         <Box position={'absolute'} bottom={55} right={20} zIndex={200}>
            <Link href={'/v1/payments/add'}>
               <Fab color='info' size='small'>
                  <FaPlus />
               </Fab>
            </Link>
         </Box>
      </>
   )
}


export default ListPayments
