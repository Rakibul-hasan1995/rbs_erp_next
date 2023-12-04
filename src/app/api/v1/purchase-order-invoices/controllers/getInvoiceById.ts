import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";
import '@/app/api/mongoose/model/User'
import '@/app/api/mongoose/model/Order'

export const getPurchaseOrderInvoiceById = async (id: string) => {
   try {
      let challan = PurchaseOrderInvoice.findById(id)
         .populate('supplier', 'user_name')
         .populate({
            path: 'items',
            // select: 'order_name program_name unit cover_photo rate qty',
            populate:
            {
               path: 'order',
               select: 'order_name program_name unit cover_photo rate qty',
               populate: {
                  path: 'cover_photo'
               }
            },
         }
         )

      const data = await challan.exec()


      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      return {
         code: 500, message: error.message, error
      }
   }
};

