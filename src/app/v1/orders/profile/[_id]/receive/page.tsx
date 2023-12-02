'use client'
import { RenderDate } from '@/v1/components/table/cell'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import { Axios } from '@/v1/utils/axios-config'
import { Box, Breadcrumbs, IconButton } from '@mui/material';
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import * as React from 'react'
import { BiSolidDashboard } from 'react-icons/bi'
import { BsEye } from 'react-icons/bs'
import { FaLayerGroup } from 'react-icons/fa'
import { Link as MUILink } from '@mui/material';
import { MdLayers } from 'react-icons/md'
import FaTruckArrowLeft from '@/v1/components/customIcons'



const Page = () => {

   const activePage = useParams()
   const id = activePage._id
   const colDef: ColDef[] = [
      {
         field: "date",
         headerName: "Date",
         filter: true,
         editable: true,
         cellRenderer: RenderDate
      },
      {
         field: "customer.user_name",
         headerName: "Customer",
         filter: true,
      },
      {
         field: "challan_no",
         headerName: "Challan No",
         filter: true,
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Link href={`/v1/receive-challans/view/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
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
         const { data } = await Axios.get(`/api/v1/orders/${id}/receive?${str}&limit=${pagination.limit}`)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Box>
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
               Profile
            </MUILink>
            <MUILink component={Link} href={`#`} underline='hover' sx={{ display: 'flex', alignItems: 'center' }}  >
               <Box mr={1}>
                  <FaTruckArrowLeft />
               </Box>
               Receive
            </MUILink>

         </Breadcrumbs>

         <UiTable
            colDef={colDef}
            rowData={rowData}
            paginationInfo={pagination}
            fetch={fetch}
            setPaginationInfo={setPagination}
         />
      </Box>)
}


export default Page
