'use client';
import {
   Box,
   Button,
   Checkbox,
   CircularProgress,
   IconButton,
   InputAdornment,
   ListItemIcon,
   ListItemText,
   Menu,
   MenuItem,
   Stack,
   TextField,
   Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import UiMenu from '@/v1/components/menu/UiMenu'
import { IoIosArrowDown } from 'react-icons/io';
import { MdClose, MdDateRange } from 'react-icons/md';
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { objToQueryString, queryStringToJSON } from '@/v1/utils/queryString'
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox'
import { FaArrowRight } from 'react-icons/fa'
import {
   DataGrid,
   GridCellEditStopParams,
   GridCellEditStopReasons,
   GridColDef,
   GridToolbarContainer,
   GridToolbarExport,
   GridToolbarQuickFilter,
   GridValueGetterParams,
   MuiEvent,
   gridClasses,
} from '@mui/x-data-grid';
import { useCustomerContext } from './context';

export default function Page() {

   const { customer, customers, fetchData, loading, setCustomer } = useCustomerContext()

   const router = useRouter()
   const pathName = usePathname()
   const searchQuery = typeof window !== 'undefined' && window.location.search ? window.location.search : '';
   const pushTo = (value: any) => {
      const qu = objToQueryString({ ...queryStringToJSON(searchQuery), ...value })
      router.push(`${pathName}?` + qu)
   }



   const searchParams = useSearchParams()
   const search = searchParams.get('search') || ''

   const SearchBar = () => {
      const [text, setText] = useState(search)
      const search_by = searchParams.get('search_by')

      const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);
      const handleClose = () => {
         setAnchorEl(null);
      };
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
         setAnchorEl(event.currentTarget);
      };

      const handleTextChange = (e: any) => {
         const text = e.target.value
         setText(text)
         // pushTo({search: text})
      }


      const handleKeyPress = (event: any) => {
         if (event.key == 'Enter') {
            event.preventDefault();
            pushTo({ search: text })
         }
      };


      const menuItemsJson = [
         {
            icon: <MdDateRange />, title: 'All Customers',
            onClick: () => { },
            value: 'hall'
         },
      ]
      const searchByItem = [
         {
            title: 'Name',
            value: 'user_name',
         },
         {
            title: 'Email',
            value: 'email',
         },
      ]



      return (
         <>
            <TextField
               size='small'
               value={text}
               placeholder='search...'
               onChange={handleTextChange}
               onKeyDown={handleKeyPress}
               InputProps={{
                  startAdornment: (
                     <InputAdornment position="start" onClick={() => { }}>
                        <IconButton
                           size='small'
                           onClick={handleClick}
                        >
                           <FaMagnifyingGlass />
                        </IconButton>
                     </InputAdornment>
                  ),
                  endAdornment: (
                     <InputAdornment position="start" onClick={() => { }}>
                        <Stack direction={'row'} spacing={1}>
                           {text.length > 3 && <IconButton
                              size='small'
                              color='error'
                              onClick={() => pushTo({ search: '' })}
                           >
                              <MdClose />
                           </IconButton>}
                           <IconButton
                              size='small'
                              onClick={() => pushTo({ search: text })}
                           >
                              {/* <FaArrowRight /> */}
                              {loading.customers ? <CircularProgress size={20} /> : <FaArrowRight />}
                           </IconButton>
                        </Stack>
                     </InputAdornment>
                  )
               }}

            />
            <Menu open={open}
               onClose={handleClose}
               anchorEl={anchorEl}
            >
               <Typography m={2}>Search By</Typography>

               {searchByItem.map((item) => (
                  <MenuItem
                     key={item.value}
                     sx={{ minWidth: '300px' }}
                     onClick={() => pushTo({ search_by: item.value })}
                  >
                     <ListItemIcon>
                        <Checkbox
                           edge="start"
                           checked={Boolean(search_by == item.value)}
                           tabIndex={-1}
                           disableRipple
                           inputProps={{ 'aria-labelledby': item.value }}
                        />
                     </ListItemIcon>
                     <ListItemText id={item.value} primary={item.title} />
                  </MenuItem>
               ))}
            </Menu>
         </>
      )
   }




   const columns: GridColDef[] = [
      {
         width: 250,
         field: 'name', headerName: 'Name',
         renderCell: (x) => (<Typography fontWeight={'500'} color={(theme) => theme.palette.primary.main}>{x.value}</Typography>)
      },
      {
         field: 'email', headerName: 'Email',
         width: 150,
         editable: true
      },
      {
         field: '_id', headerName: 'Phone',
         width: 150,
         valueGetter: (params: GridValueGetterParams) => params.row.contact_details.phone
      },
      {
         field: 'closing_amount_formatted', headerName: 'Closing Balance',
         flex: 1,
         align: "right",
         headerAlign: "right",
         renderCell: (x) => (<Typography color={(theme) => theme.palette.primary.main}>{x.value}</Typography>)
      },

      // {
      //    field: 'fullName',
      //    headerName: 'Full name',
      //    description: 'This column has a value getter and is not sortable.',
      //    sortable: false,
      //    // valueGetter: (params: GridValueGetterParams) =>
      //    //    `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      // },
   ];





   function CustomToolbar() {
      return (
         <GridToolbarContainer>
            <GridToolbarExport />
            <GridToolbarQuickFilter />
         </GridToolbarContainer>
      );
   }
   const handleRowClick = (id: any) => {
      router.push(`customers/${id}?${searchQuery}`)
   }


   return (
      <Box>
         {/* header =========>>> */}
         <Box p={2}
            // boxShadow={1}
            display={'flex'} justifyContent={"space-between"}
         >
            {/* left ==========>>> */}
            <Box>
               <Stack direction={'row'} spacing={5}>
                  <UiMenu
                     title='All'
                     buttonProps={{ variant: 'outlined', endIcon: <IoIosArrowDown /> }}
                     itemJson={[{ title: "All", onClick: () => { } }]}
                  />
                  <SearchBar />
               </Stack>

            </Box>
            {/* left ==========<<< */}

            {/* right ==========>>> */}
            <Box>
               <Button
                  size='small'
                  variant='contained'
                  color='success'
               >+ New</Button>
            </Box>
            {/* right ==========<<< */}
         </Box>
         {/* header =========<<< */}



         {customer ? <></> :
            <CustomScrollbarBox maxHeight={'calc(100vh - 147px)'} width={'220mm'} mx={'auto'} >
               {/* <CustomScrollbarBox mt={1} maxHeight={'calc(100vh - 145px)'}  > */}
               <DataGrid
                  onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
                     if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                        event.defaultMuiPrevented = true;
                        console.log(params)
                     }
                  }}
                  onRowClick={(item) => { handleRowClick(item.id) }}

                  rows={customers?.data || []}

                  editMode='cell'
                  columns={columns}
                  rowSelection={false}
                  getRowId={(item) => item._id}
                  slots={{
                     toolbar: CustomToolbar
                  }}
                  slotProps={{
                     toolbar: {
                        showQuickFilter: true,
                     },
                  }}

                  initialState={{
                     pagination: {
                        paginationModel: { page: 0, pageSize: 50 },
                     },
                  }}
                  loading={loading.customers}
                  rowCount={customers?.pagination.totalDocuments || 0}
                  onPaginationModelChange={(x) => { pushTo({ limit: x.pageSize, page: x.page + 1 }) }}
                  paginationMode='server'
                  pageSizeOptions={[5, 25, 50, 100, 1000]}
                  checkboxSelection={false}
                  sx={(theme) => ({
                     [`.${gridClasses.main}`]: {
                        overflow: "unset"
                     },
                     [`.${gridClasses.columnHeaders}`]: {
                        position: "sticky",
                        top: 0,
                        backgroundColor: theme.palette.background.paper,
                        zIndex: 1
                     },
                     [`.${gridClasses.row}`]: {
                        cursor: 'pointer'
                     },
                     [`.${gridClasses.virtualScroller}`]: {
                        marginTop: "0 !important"
                     }
                  })}
               />
            </CustomScrollbarBox>}
      </Box>
   )
}
