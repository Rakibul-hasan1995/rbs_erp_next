import updatePurchaseOrderValidation from "@/app/api/lib/validation/updatePurchaseOrderValidation";
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder";

export const updatePurchaseOrder = async (id: string, body: any,) => {
   try {

      const purchaseOrder = await PurchaseOrder.findById(id)
      if (!purchaseOrder) {
         return {
            code: 400,
            message: 'purchase order not found'
         }
      }

      const validate = updatePurchaseOrderValidation(body);

      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }

      Object.assign(purchaseOrder, validate.data)

      await purchaseOrder.save();
      return {
         code: 200,
         data: purchaseOrder,
         message: 'Successfully Update Data'
      }


   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }

}