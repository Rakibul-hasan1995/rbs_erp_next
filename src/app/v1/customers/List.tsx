'use client'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import { Axios } from '@/v1/utils/axios-config'
import { Box, Fab, IconButton } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import * as React from 'react'
import { BsEye } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'




const UserList = () => {

   const colDef: ColDef[] = [
      {
         field: "user_name",
         headerName: "Name",
         filter: true,
         editable: true,
         cellRenderer: (params: any) => {
            return (
               <Link href={`/v1/customers/profile/${params.data._id}`} passHref legacyBehavior>
                  <span className='link-text'>{params.value}</span>
               </Link>
            )
         }
      },
      {
         field: "email",
         headerName: "Email",
         filter: true,
      },
      {
         field: "contact_detail.phone",
         headerName: "Phone",
         filter: true,
      },
      {
         field: "contact_details.address",
         headerName: "Address",
         filter: true,
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellRenderer: (params: any) => {
            return (
               <Box sx={{ width: '100%', display: 'flex', justifyItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Link href={`/v1/customers/profile/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='primary'>
                        <BsEye />
                     </IconButton>
                  </Link>
                  {/* <Link href={`/v1/orders/update/${params.value}`} passHref legacyBehavior>
                     <IconButton size='small' color='warning'>
                        <TbEdit />
                     </IconButton>
                  </Link> */}
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
         const { data } = await Axios.get(`/api/v1/users?roll=customer&limit=${pagination.limit}&${str}`)
         console.log(data)
         setRowData(data.data)
         setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
      } catch (error) {
         console.log(error)
      }
   }

   return <>
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
         <Link href={'/v1/customers/add'}>
            <Fab color='info' size='small'>
               <FaPlus />
            </Fab>
         </Link>
      </Box>
   </>
}


export default UserList
