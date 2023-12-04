'use client'
import { RenderImage, RenderNumber } from '@/v1/components/table/cell'
import { Pagination } from '@/v1/components/table/paginationBar'
import UiTable from '@/v1/components/table/uiTable'
import useConfig from '@/v1/hooks/useConfig'
import { PurchaseOrdersExpand } from '@/v1/utils/Types'
import { Axios } from '@/v1/utils/axios-config'
import { Box, Fab, IconButton } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import Link from 'next/link'
import * as React from 'react'
import toast from 'react-hot-toast'
import { BsEye } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'

const ListPurchaseOrders = () => {
  const { config } = useConfig()
  const colDef: ColDef[] = [
    {
      field: "supplier.user_name",
      headerName: "Supplier",
      filter: true,
      editable: false,
    },
    {
      field: "order.program_name",
      headerName: "Program",
      filter: true,
      editable: false,
    },
    {
      field: "order.order_name",
      headerName: "Order Name",
      filter: true,
      editable: false,
    },
    {
      field: "qty",
      headerName: "Qty",
      filter: false,
      editable: true
    },
    {
      field: "rate",
      headerName: "Rate",
      filter: false,
      cellRenderer: RenderNumber,
      editable: true
    },
    {
      field: "order.cover_photo.href",
      headerName: "Design",
      filter: false,
      cellRenderer: RenderImage
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
            {/* <Link href={`/v1/customers/profile/${params.value}`} passHref legacyBehavior> */}
            <IconButton size='small' color='primary'>
              <BsEye />
            </IconButton>
            {/* </Link> */}
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




  const [rowData, setRowData] = React.useState<PurchaseOrdersExpand[]>()
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
      const { data } = await Axios.get(`/api/v1/purchase-orders?limit=${pagination.limit}&${str}`)
      setRowData(data.data)
      console.log(data.data)
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

      const { data } = await Axios.put(`api/v1/purchase-orders/${id}`, obj)

      if (data.code == 200) {
        toast.success(`successfully update ${data.data.order_name} - ${field}`)
      }
    } catch (error) {
      console.log(error)
      toast.error(`error in update Order`)
    }
  }


  return (
    <>
      {rowData && <UiTable
        colDef={colDef}
        rowData={rowData}
        paginationInfo={pagination}
        fetch={fetch}
        setPaginationInfo={setPagination}
        // loading={true}
        onCellValueChanged={handleUpdateOrder}
      />}
      <Box position={'absolute'} bottom={55} right={20} zIndex={200}>
        <Link href={'/v1/purchase_orders/add'}>
          <Fab color='info' size='small'>
            <FaPlus />
          </Fab>
        </Link>
      </Box>
    </>
  )
}


export default ListPurchaseOrders
