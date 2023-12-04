import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";
import '@/app/api/mongoose/model/Gallery'
import { User } from "@/app/api/mongoose/model/User";
import mongoose from "mongoose";

export const findPurchaseOrderInvoice = async (url: any) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'asc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'createdAt')
      const searchTerm = getQueryParams(url as string, 'search', undefined)
      const searchBy = getQueryParams(url as string, 'search_by', 'invoice_no')
      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         if (searchBy.includes('items') || searchBy.includes('supplier')) {
            filter = { [searchBy]: searchTerm }
         } else if (searchBy.includes('invoice_no')) {
            filter = { invoice_no: { $regex: regex } }
         } else {
            filter = {}
         }
      }

      if (searchBy == 'supplier.user_name') {
         const suppliers = await User.find({ user_name: regex })
         const customersIds = suppliers.map((item) => { return new mongoose.Types.ObjectId(item._id) })
         filter = { supplier: { $in: customersIds }, }
      }



      const data = await PurchaseOrderInvoice.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('cover_photo', 'href')
         .populate('supplier', 'user_name')
         .exec()
      const count = await PurchaseOrderInvoice.countDocuments(filter)
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

interface RootObject {
   code: number;
   data: PurchaseOrderInvoiceType;
}
export interface PurchaseOrderInvoiceType {
   supplier: {
      _id: string;
      user_name: string
   };
   date: string;
   invoice_no: string;
   supplier_bill_no: number;
   discount: number;
   amount: number;
   status: string;
   supplier_prev_deu: number;
   items: string[];
   remarks: string;
   cover_photo: {
      _id: string;
      href: string
   }
}