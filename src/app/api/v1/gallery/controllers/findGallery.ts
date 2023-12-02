import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { Gallery } from "@/app/api/mongoose/model/Gallery";

export const findGallery = async (url: string) => {
   try {

      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 25)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'created_at')
      const searchTerm = getQueryParams(url as string, 'search', '')
      const searchBy = getQueryParams(url as string, 'search_by', 'tags')

      const skip = (page - 1) * limit;

      const regex = new RegExp(searchTerm, 'i')
      let filter = {}
      if (searchBy && searchTerm) {
         filter = { [searchBy]: { $regex: regex } }
      }

      const data = await Gallery.find(filter)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('customer', 'user_name')
         .exec()

      const count = await Gallery.countDocuments(filter)
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

