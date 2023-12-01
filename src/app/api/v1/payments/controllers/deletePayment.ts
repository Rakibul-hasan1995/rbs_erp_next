import { Payment } from "@/app/api/mongoose/model/Payment"
import { Trash } from "@/app/api/mongoose/model/Trash"

export const deletePayment = async (id: string) => {
   try {
   
      const payment = await Payment.findById(id)
      if (!payment) {
         return {
            code: 400, data: { filed: '_id', value: 'payment Not Found' }, message: 'payment Not Found'
         }
      }
      let trash = new Trash({
         _id: payment._id,
         data: JSON.stringify(payment),
         collectionName: 'payment'
      })
      const suc = await trash.save()
      const del = await payment.deleteOne()
      return {
         "code": 200,
         "message": "Successfully delete Data"
      }
   } catch (error: any) {
      return {
         error,
         code: 500,
         message: error.message
      }
   }
}