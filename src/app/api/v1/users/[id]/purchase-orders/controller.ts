import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";

import '@/app/api/mongoose/model/Gallery'
import mongoose from "mongoose";
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder";



export const getPurchaseOrdersBySupplierId = async (supplierId: string, url: string) => {

   try {
      const page = getQueryParams(url, 'page', 1);
      const limit = getQueryParams(url, 'limit', 10)
      const sortType = getQueryParams(url, 'sort_type', 'asc')
      const sortKey = getQueryParams(url, 'sort_key', 'user_name')
      const searchTerm = getQueryParams(url, 'search', undefined)
      const searchBy = getQueryParams(url, 'search_by', undefined)
      const expand = getQueryParams(url, 'expand', false)

      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')

      let filter = {}

      if (searchBy && searchTerm) {
         filter = { [searchBy]: { $regex: regex } }
      }
      if (searchTerm && !searchBy) {
         filter = {
            $or: [
               { program_name: { $regex: regex } },
               { order_name: { $regex: regex } },

            ],
         }
      }
      const query = {
         $and: [
            { supplier: new mongoose.Types.ObjectId(supplierId) },
            { ...filter }
         ]
      }



      const orders = PurchaseOrder.find(query)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         // .populate('cover_photo', 'href')
         .populate('supplier', 'user_name exchange_rate')
         .populate({
            path: 'order',
            // select: 'order_name program_name unit cover_photo rate qty',
            populate: {
               path: 'cover_photo'
            }
         }
         )


      let data


      if (expand) {

         data = await orders.exec()



      } else {
         data = await orders.exec()
      }

  
      const count = await PurchaseOrder.countDocuments(query)
      const pagination = generatePagination(page, limit, count)

      const response = {
         code: 200,
         data,
         pagination,
      };

      return response
   } catch (error) {
      console.log(error)
      return { code: 500, error: error }
   }
};
