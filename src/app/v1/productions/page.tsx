'use client'
import { RenderDate, RenderNumber } from '@/v1/components/table/cell'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import { useThemeContext } from '@/v1/context/themeContext'
import useConfig from '@/v1/hooks/useConfig'
import { Axios } from '@/v1/utils/axios-config'
import { Box, Fab, IconButton } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import * as React from 'react'
import toast from 'react-hot-toast'
import { BsEye } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { TbEdit } from 'react-icons/tb'




const ListProductions = () => {

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
         field: "shift",
         headerName: "Shift",
         filter: true,
         editable: true,
         cellEditor: "agSelectCellEditor",
         cellEditorParams: {
            values: config?.shifts?.map((item: any) => { return item })
         },
      },
      {
         field: "total_amount",
         headerName: "Amount",
         filter: false,
         editable: false,
         cellClass: 'justify-end',
         cellRenderer: RenderNumber,
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellClass: 'justify-center',
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Link href={`/v1/productions/view/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
                     </IconButton>
                  </Link>
                  <Link href={`/v1/productions/update/${params.value}`} passHref legacyBehavior>
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
      setTitle("Production List")
      return () => { setTitle('RBS') }
   }, [])



   const fetch = async (str: string) => {
      try {

         const { data } = await Axios.get(`/api/v1/productions?limit=${pagination.limit}&${str}`)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }


   const handleUpdateProduction = async (api: any) => {
      try {
         const field = api.column.colId
         const value = api.value
         const obj = { [field]: value }
         const id = api.data._id
         const { data } = await Axios.put(`api/v1/productions/${id}`, obj)

         if (data.code == 200) {
            toast.success(`successfully update Data`)
         }
      } catch (error) {
         console.log(error)
         toast.error(`error in update invoice`)
      }
   }


   return (<>

      <UiTable
         colDef={colDef}
         rowData={rowData}
         paginationInfo={pagination}
         fetch={fetch}
         setPaginationInfo={setPagination}
         // loading={true}
         onCellValueChanged={handleUpdateProduction}
      />
      <Box position={'absolute'} bottom={55} right={20} zIndex={200}>
         <Link href={'/v1/productions/add'}>
            <Fab color='info' size='small'>
               <FaPlus />
            </Fab>
         </Link>
      </Box>
   </>)
}


export default ListProductions
