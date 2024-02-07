import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Account } from "@/app/api/mongoose/model/account";


export const findAccounts = async (url: any, ) => {
   try {

      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'invoice_no')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)


      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         filter = { [searchBy]: { $regex: regex } }
      }

      const account = await Account.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType == 'desc' ? 1 : -1 })
         .exec()

      const count = await Account.countDocuments(filter)
      const pagination = generatePagination(page, limit, count)
      const response = {
         code: 200,
         data: account,
         pagination,
      };

      return response
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
};

