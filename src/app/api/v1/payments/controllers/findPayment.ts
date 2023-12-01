import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Payment } from "@/app/api/mongoose/model/Payment";
import { User } from "@/app/api/mongoose/model/User";
import mongoose from "mongoose";

export const findPayments = async (url: any,) => {
   try {

      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'receipt_no')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)

      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         if (searchBy.includes('customer')) {
            filter = { [searchBy]: searchTerm }
         } else {
            filter = { [searchBy]: { $regex: regex } }
         }
      }

      if (searchBy == 'customer.user_name') {
         const customers = await User.find({ user_name: regex })
         const customersIds = customers.map((item) => { return new mongoose.Types.ObjectId(item._id) })
         filter = { customer: { $in: customersIds }, }
      }


      const data = await Payment.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('customer', 'user_name')
         .exec()
      const count = await Payment.countDocuments(filter)
      const pagination = generatePagination(page, limit, count)
      const response = {
         code: 200,
         data,
         pagination,
      };

      return response
   } catch (error: any) {
      return {
         code: 500,
         message: error.message,
         error
      }
   }
};

