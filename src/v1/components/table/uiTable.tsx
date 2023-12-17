import * as React from 'react';

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Box, IconButton } from '@mui/material';
import { AgGridEvent, ColDef } from 'ag-grid-community';
import { useThemeContext } from '@/v1/context/themeContext';
import TablePaginationBar, { Pagination } from './paginationBar';
import { objToQueryString } from '@/v1/utils/queryString';
import { RiFilter2Fill, RiFilterOffFill } from 'react-icons/ri';
import './style.css'

interface Props {
   colDef: ColDef[];
   rowData: any[];
   paginationInfo: Pagination;
   fetch: (arg: string) => void;
   setPaginationInfo: (arg: Pagination) => void;
   // loading?: boolean;
   onCellValueChanged?: (action: { data: any }) => void;
}

const UiTable = ({ colDef, rowData, paginationInfo, setPaginationInfo, fetch, onCellValueChanged }: Props) => {

   const [serverFilter, setServerFilter] = React.useState(true)

   const [filter, setFilter] = React.useState({})
   const [sorting, setSorting] = React.useState({})

   const queryString = objToQueryString({ ...filter, ...sorting })

   const handleSetLimit = (value: number) => {
      setPaginationInfo({ ...paginationInfo, limit: value })
      fetch(`${queryString}&limit=${value}`)

   }

   const onPageChange = (pageNo: number) => {
      // setCurrentPage(pageNo)
      fetch(`page=${pageNo + 1}${queryString ? `&${queryString}` : ''}`)
   }



   const onFilterChanged = async (event: any) => {
      const api = event.api;
      const filterModel = api.getFilterModel();

      const key = Object.keys(filterModel)[0]
      const value = filterModel[key]?.filter

      if (value !== undefined) {

         if (serverFilter) {
            const obj = { search_by: key, search: value }
            const q = objToQueryString({ ...sorting, ...obj })
            setFilter(obj)
            fetch(q)
         }
      } else if (serverFilter) {
         setFilter({})
         fetch(objToQueryString(sorting))
      }
   }

   const onSortChanged = async (event: AgGridEvent) => {
      const sortedColumn = event.columnApi.getColumnState().find(col => Boolean(col.sort));
      if (sortedColumn) {
         const sort_key = sortedColumn.colId || undefined
         const sort_type = sortedColumn.sort || undefined
         if (sort_type) {
            const obj = { sort_type, sort_key }
            setSorting(obj)
            fetch(objToQueryString({ ...filter, ...obj }))
         }
      }
   }

   const defaultColDef = React.useMemo(() => {
      return {
         flex: 1,
         minWidth: 80,
         filter: true,
         floatingFilter: true,
         sortable: true,
         resizable: true,
         editable: false,
      };
   }, []);

   const { isDarkMode } = useThemeContext()
   return (
      <Box position={'relative'} >
         <Box zIndex={1} right={0} top={0} position={'absolute'}>
            <IconButton onClick={() => setServerFilter((prec) => !prec)} >
               {serverFilter ? <RiFilter2Fill /> : <RiFilterOffFill style={{ color: 'red' }} />}
            </IconButton>
         </Box>
         <Box
            component={'div'}
            className={
               `${!isDarkMode
                  ? "ag-theme-alpine"
                  : "ag-theme-alpine-dark"
               }  `
            }
            sx={{ width: '100%', height: `calc(100vh - 132px)`, borderRadius: 25 }}
         >
            <AgGridReact
               rowHeight={50}
               onFilterChanged={onFilterChanged}
               onSortChanged={onSortChanged}
               rowData={rowData} // Row Data for Rows           
               defaultColDef={defaultColDef}
               animateRows={true} // Optional - set to 'true' to have rows animate when sorted
               rowSelection='multiple' // Options - allows click selection of rows
               columnDefs={colDef}
               onCellValueChanged={onCellValueChanged}

            />
            <TablePaginationBar
               paginationInfo={paginationInfo}
               onPageChange={onPageChange}
               setItemPerPage={handleSetLimit}

            />
         </Box>
      </Box>
   );
};

export default UiTable;