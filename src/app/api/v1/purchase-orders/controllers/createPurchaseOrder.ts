import purchaseOrderValidation from "@/app/api/lib/validation/purchaseOrderValidation"
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder"

export const createPurchaseOrder = async (body: any,) => {
   try {

      const validate = purchaseOrderValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const purchaseOrder = new PurchaseOrder(validate.data)
      await purchaseOrder.save()
      return { code: 201, data: purchaseOrder, links: { self: `/api/v1/purchase-orders/${purchaseOrder._id}` } }
   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }

}

