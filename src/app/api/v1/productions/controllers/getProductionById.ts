import { Production } from "@/app/api/mongoose/model/Production";

export const getProductionById = async (id: string, expand: boolean) => {
   try {
      let query = Production.findById(id)
      if (expand) {
         query
            .populate([
               { path: 'production_data.operator', select: 'user_name' },
               {
                  path: 'production_data.order',
                  // select: '-category',
                  populate: [
                     {
                        path: 'customer',
                        select: 'user_name exchange_rate'
                     },
                     {
                        path: 'cover_photo',
                        select: 'href'
                     },
                  ]
               }])
      }
      // else {
      //    query
      //       .select('-customer -category -tags -image_gallery  -createdAt -updatedAt -__v')
      // }
      const data = await query.exec()

      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      return {
         code: 200,
         error,
         message: error.message
      }
   }

}
