import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import "@/app/api/mongoose/model/User";
import "@/app/api/mongoose/model/Order";
import "@/app/api/mongoose/model/Gallery";
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder";
import { User } from "@/app/api/mongoose/model/User";
import mongoose from "mongoose";

export const findPurchaseOrder = async (url: any,) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'asc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'user_name')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', undefined)

      const skip = (page - 1) * limit;


      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         if (searchBy.includes('supplier') || searchBy.includes('order')) {
            filter = { [searchBy]: searchTerm }
         } else {
            filter = { [searchBy]: { $regex: regex } }
         }
      }

      if (searchBy == 'supplier.user_name') {
         const suppliers = await User.find({ user_name: regex })
         console.log({suppliers})
         const customersIds = suppliers.map((item) => { return new mongoose.Types.ObjectId(item._id) })
         filter = { supplier: { $in: customersIds }, }
      }

      const data = await PurchaseOrder.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('supplier', 'user_name')
         .populate({
            path: 'order',
            select: 'order_name program_name unit cover_photo rate qty',
            populate: [
               {
                  path: 'cover_photo',
                  select: 'href'
               },
            ]
         } )

         .exec()
      const count = await PurchaseOrder.countDocuments(filter)
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

