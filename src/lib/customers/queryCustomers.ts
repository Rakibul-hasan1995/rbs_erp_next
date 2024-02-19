import generatePagination from "@/app/api/lib/generatePagination copy";
import { User } from "@/app/api/mongoose/model/User";
import { Pagination } from "@/types";
import { Customer, CustomerQueryParams } from "@/types/customers";



type Response = {
   data: Customer[];
   pagination: Pagination
}
type QueryCustomer = (arg: CustomerQueryParams) => Promise<Response>
export const queryCustomer: QueryCustomer = async (arg) => {
   try {
      const { limit, page, search, search_by, sort_key = 'createdAt', sort_type = 'desc' } = arg

      const skip = (+page - 1) * +limit;

      const regex = new RegExp(`${search}`, 'i')
      let filter = {}
      if (search_by && search) {
         filter = { [`${search_by}`]: { $regex: regex } }
      }

      if (Object.keys(filter).length) {
         filter = {
            $and:
               [
                  { roll: 'customer' },
                  { ...filter },
               ]
         }
      } else {
         filter = { roll: 'customer' }
      }

      let customers = await User.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sort_key]: sort_type == 'asc' ? 1 : -1 })
         .exec()

      const data = customers.map((item) => ({
         _id: item._id,
         name: item.user_name,
         email: item.email
      }))

      const count = await User.countDocuments(filter)
      const pagination = generatePagination(page, limit, count)

      return {
         data,
         pagination: pagination
      }


   } catch (error: any) {
      throw error
   }
}
