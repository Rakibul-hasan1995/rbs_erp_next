
import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";

export const findChallanByOrder = async (Model: any, url: any, orderId: string) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 25)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'date')
      const skip = (page - 1) * limit;

      let filter = { 'items.order': { $in: orderId } }

      const data = await Model.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('customer', 'user_name')
         .exec()

      const count = await Model.countDocuments(filter)
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

