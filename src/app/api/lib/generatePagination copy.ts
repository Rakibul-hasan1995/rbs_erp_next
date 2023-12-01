export interface Pagination {
   nextPage: number | null,
   prevPage: number | null,
   currentPage: number | null,
   totalPages: number | null,
   totalDocuments: number | null
}
const generatePagination = (page: number, limit: number, totalRecords: number): Pagination => {
   const totalPages = Math.ceil(totalRecords / limit);

   const hasNextPage = page < totalPages;
   const hasPrevPage = page > 1;
   const pagination: Pagination = {
      nextPage: hasNextPage ? +page + 1 : null,
      prevPage: hasPrevPage ? +page - 1 : null,
      currentPage: +page,
      totalPages,
      totalDocuments: totalRecords
   };
   return pagination
}


export default generatePagination
