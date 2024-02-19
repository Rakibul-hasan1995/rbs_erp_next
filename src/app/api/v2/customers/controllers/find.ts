import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { customerBalanceSummary } from "@/lib/customers/getCustomerBalance";
import { queryCustomer } from "@/lib/customers/queryCustomers";

export const findCustomer = async (req: Request) => {

   try {
      const page = getQueryParams(req.url as string, 'page', 1);
      const limit = getQueryParams(req.url as string, 'limit', 10)
      const sort_type = getQueryParams(req.url as string, 'sort_type', 'asc')
      const sort_key = getQueryParams(req.url as string, 'sort_key', 'user_name')
      const search = getQueryParams(req.url as string, 'search', undefined)
      const search_by = getQueryParams(req.url as string, 'search_by', undefined)
      const expand = getQueryParams(req.url as string, 'expand', false)

      const customers = await queryCustomer({ page: +page, limit: +limit, search, sort_key, sort_type, search_by })

      if (!expand) {
         return { data: customers, code: 200 }
      } else {
         const ids: any = customers.data.map((item) => item._id)
         const data = await customerBalanceSummary(ids)
         return { data: data, code: 200, pagination: customers.pagination }
      }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }

}