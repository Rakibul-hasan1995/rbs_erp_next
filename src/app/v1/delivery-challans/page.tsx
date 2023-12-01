'use client'
import { RenderDate } from '@/v1/components/table/cell'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import { Axios } from '@/v1/utils/axios-config'
import { Box, IconButton } from '@mui/material';
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import * as React from 'react'
import toast from 'react-hot-toast'
import { BsEye } from 'react-icons/bs'




const page = () => {
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
            <Link href={`/v1/delivery-challans/view/${params.value}`} passHref legacyBehavior>
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
      const { data } = await Axios.get(`/api/v1/delivery-challans?${str}&limit=${pagination.limit}`)
      setRowData(data.data)
      setPagination((prev) => ({ ...data.pagination, limit: prev.limit }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (api: any) => {
    try {
      const field = api.column.colId
      const value = api.value

      const obj = { [field]: value }
      const id = api.data._id

      const { data } = await Axios.put(`api/v1/delivery-challan/${id}`, obj)

      if (data.code == 200) {
        toast.success(`successfully update ${data.data.challan_no} - (${field})`)
      }
    } catch (error) {
      console.log(error)
      toast.error(`error in update invoice`)
    }
  }
  return <UiTable
    colDef={colDef}
    rowData={rowData}
    paginationInfo={pagination}
    fetch={fetch}
    setPaginationInfo={setPagination}
    onCellValueChanged={handleUpdate}
  />
}


export default page
