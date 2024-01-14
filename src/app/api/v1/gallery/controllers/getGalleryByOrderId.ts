import { Order } from "@/app/api/mongoose/model/Order";

export const findGalleryByOrder = async (orderId: string) => {
   try {
      const data = await Order.findById(orderId)
         .populate('image_gallery')
         .select('image_gallery')
         .exec()
      const response = {
         code: 200,
         data,
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

