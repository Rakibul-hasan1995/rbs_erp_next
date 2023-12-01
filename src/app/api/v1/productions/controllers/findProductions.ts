import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Production } from "@/app/api/mongoose/model/Production";

export const findProductions = async (url: string) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'date')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)
      const skip = (page - 1) * limit;
      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         if (searchBy.includes('production')) {
            filter = { [searchBy]: searchTerm }
         } else {
            filter = { [searchBy]: { $regex: regex } }
         }
      }
      const data = await Production.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .exec()

      const count = await Production.countDocuments(filter)
      const pagination = generatePagination(page, limit, count)
      const response = {
         code: 200,
         data,
         pagination,
      };
      return response
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
};

