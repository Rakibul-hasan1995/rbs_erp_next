export interface Pagination {
   nextPage: number | null;
   prevPage: number | null,
   currentPage: number;
   totalPages: number;
   totalDocuments: number;
   limit: number
}
