import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

export interface Pagination {
   nextPage: number | null;
   prevPage: number | null,
   currentPage: number;
   totalPages: number;
   totalDocuments: number;
   limit: number
}

interface Props {
   paginationInfo: Pagination
   onPageChange: (arg: number) => void
   setItemPerPage: (arg: number) => void
}


export default function TablePaginationBar({ paginationInfo, onPageChange, setItemPerPage }: Props) {

   const handleChangePage = (
      _event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
   ) => {
      onPageChange(newPage)
   };

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      setItemPerPage(parseInt(event.target.value, 10))
   };

   return (
      <TablePagination
         component="div"
         count={paginationInfo.totalDocuments}
         showFirstButton
         showLastButton
         page={paginationInfo.currentPage - 1}
         rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
         onPageChange={handleChangePage}
         rowsPerPage={paginationInfo.limit}
         onRowsPerPageChange={handleChangeRowsPerPage}
      />
   );
}
