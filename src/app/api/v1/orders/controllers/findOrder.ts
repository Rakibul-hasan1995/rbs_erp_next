
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { User } from "@/app/api/mongoose/model/User";
import mongoose from "mongoose";
import { queryOrder } from "./helpers/queryOrder";
export const findOrder = async (url: string) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)
      const filterKey = getQueryParams(url as string, 'filter_key', '')
      const filterValue = getQueryParams(url as string, 'filter_value', '')

      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')
      let query = {}

      if (filterKey && filterValue) {
         query = {
            [filterKey]: {
               $nin: filterValue,
            },
         }
      }
      if (searchBy && searchTerm) {
         query = { [searchBy]: { $regex: regex } }
      }

      if (searchTerm && !searchBy) {
         query = {
            $or: [
               { program_name: { $regex: regex } },
               { order_name: { $regex: regex } },

            ],
         }
      }

      if (searchBy == 'customer.user_name') {
         const customers = await User.find({ user_name: regex })
         const customersIds = customers.map((item) => { return new mongoose.Types.ObjectId(item._id) })
         query = { customer: { $in: customersIds }, }
      }
       return await queryOrder(url, query)

   } catch (error: any) {
      return { code: 500, message: error.message }
   }
};
