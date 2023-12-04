import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder";

export const getPurchaseOrderById = async (id: string) => {
   try {
      let purchaseOrder = PurchaseOrder.findById(id)
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
         }
         )
      const data = await purchaseOrder.exec()
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

