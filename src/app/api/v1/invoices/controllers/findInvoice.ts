import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { User } from "@/app/api/mongoose/model/User";
import '@/app/api/mongoose/model/Gallery'

// only allow for filter = 'items ? order' | 'customer' | 'invoice_no'
export const findInvoice = async (url: any) => {
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
         if (searchBy.includes('items') || searchBy.includes('customer')) {
            filter = { [searchBy]: searchTerm }
         } else if (searchBy.includes('invoice_no')) {
            filter = { invoice_no: { $regex: regex } }
         } else {
            filter = {}
         }
      }

      if (searchBy == 'customer.user_name') {
         const customers = await User.find({ user_name: regex })
         const customersIds = customers.map((item) => item._id)
         filter = { customer: { $in: customersIds }, }
      }

      const data = await Invoice.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('customer', 'user_name')
         .populate('cover_photo', 'href')
         .exec()

      const count = await Invoice.countDocuments(filter)
      const pagination = generatePagination(page, limit, count)
      const response = {
         code: 200,
         data,
         pagination,
      };

      return response
   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }
};

