import paymentValidation from "@/app/api/lib/validation/createPaymentValidation"
import { Payment } from "@/app/api/mongoose/model/Payment"

export const createPayment = async (body: any) => {
   try {

      const validate = paymentValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const payment = new Payment(validate.data)

      await payment.save()

      return { code: 201, data: payment, links: { self: `/api/v1/payments/${payment._id}` } }

   } catch (error: any) {
      return {
         code: 500,
         error,
         message: error.message
      }
   }

}


