import { createJournal } from "@/app/api/lib/transactions/createJournal"
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
      await createJournal({
         amount: payment.amount,
         date: payment.date,
         paid_from_account: "65c0c17289eed83404adf657",
         paid_to_account: "65b88a8880a3b3419a5804ea",
         type: "Customer Payment",
         customer_id: payment.customer,
         reference: `MRC_No: ${payment.receipt_no}`
      })
      return { code: 201, data: payment, links: { self: `/api/v1/payments/${payment._id}` } }

   } catch (error: any) {
      return {
         code: 500,
         error,
         message: error.message
      }
   }

}


