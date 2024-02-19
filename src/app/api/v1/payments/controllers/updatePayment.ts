import updatePaymentValidation from "@/app/api/lib/validation/updatePaymentsValidation";
import { Payment } from "@/app/api/mongoose/model/Payment";
import { Transaction } from "@/app/api/mongoose/model/transaction";
import { updateTransaction } from "@/app/api/v2/transactions/controllers/updateTransaction";

export const updatePayment = async (id: string, body: any) => {
   try {

      const payment = await Payment.findById(id)
      if (!payment) {
         return {
            code: 400,
            message: 'payment not found'
         }
      }

      const validate = updatePaymentValidation(body);

      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }

      Object.assign(payment, validate.data)

      await payment.save();

      
      const transaction = await Transaction.findOne({ ref_id: payment._id })
      if (transaction) {
         await updateTransaction({ amount: payment.amount }, transaction._id)
      }



      return {
         code: 200,
         data: payment,
         message: 'Successfully Update Data'
      }
   } catch (error: any) {
      return {
         error,
         code: 500,
         message: error.message
      }
   }

}