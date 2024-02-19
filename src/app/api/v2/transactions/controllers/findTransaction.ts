import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { queryTransactions } from "@/app/api/lib/transactions/queryTransactions";
import moment from "moment";

export const findTransactions = async (url: any) => {
   try {


      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'invoice_no')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)
      const isDebit = getQueryParams(url as string, 'is_debit', 'false') == 'true'
      const isCredit = getQueryParams(url as string, 'is_credit', 'false') == 'true'
      const start_date = getQueryParams(url as string, 'start_date', moment('2022').startOf('month').toISOString())
      const end_date = getQueryParams(url as string, 'end_date', moment().endOf('month').toISOString())

      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         filter = { [searchBy]: { $regex: regex } }
      }
      if (isDebit) {
         filter = { ...filter, debit_amount: { $gt: 0 } }
      }
      if (isCredit) {
         filter = { ...filter, credit_amount: { $gt: 0 } }
      }
      if (start_date) {
         filter = { ...filter, date: { $gt: new Date(start_date), $lt: new Date(end_date) } }
      }

      const { data, pagination } = await queryTransactions({ page, limit, sortKey, sortType, filter })


      const response = {
         code: 200,
         data,
         pagination,
         dateRange: `From ${moment(start_date).format('DD MMM yyyy')} To ${moment(end_date).format('DD MMM yyyy')}`
      };

      return response
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
};

