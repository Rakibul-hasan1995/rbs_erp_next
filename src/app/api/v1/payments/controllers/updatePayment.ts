import updatePaymentValidation from "@/app/api/lib/validation/updatePaymentsValidation";
import { Payment } from "@/app/api/mongoose/model/Payment";

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