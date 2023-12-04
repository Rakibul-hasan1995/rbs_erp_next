import { Trash } from "@/app/api/mongoose/model/Trash"
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder"

export const deletePurchaseOrder = async (id: string) => {
   try {
      const purchaseOrder = await PurchaseOrder.findById(id)
      if (!purchaseOrder) {
         return {
            code: 400, data: { filed: '_id', value: 'purchaseOrder Not Found' }, message: 'purchaseOrder Not Found'
         }
      }
      let trash = new Trash({
         _id: purchaseOrder._id,
         data: JSON.stringify(purchaseOrder),
         collectionName: 'purchaseOrder'
      })
      const suc = await trash.save()
      const del = await purchaseOrder.deleteOne()
      return {
         "code": 200,
         "message": "Successfully delete Data"
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