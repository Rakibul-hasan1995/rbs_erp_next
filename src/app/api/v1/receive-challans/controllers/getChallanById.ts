import '@/app/api/mongoose/model/User'
import '@/app/api/mongoose/model/Order'
import '@/app/api/mongoose/model/Gallery'

export const getChallanById = async (Model: any, id: string, expand: boolean) => {
   try {


      let challan = Model.findById(id)
         .populate('customer', 'user_name contact_details')

      if (expand) {
         challan
            .populate({
               path: 'items.order',
               select: 'customer order_name program_name unit cover_photo',
               populate: [
                  {
                     path: 'cover_photo',
                     select: 'href'
                  },
               ]
            }
            )
      }

      const data = await challan.exec()


      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }
};

