import { createJournal } from "@/app/api/lib/transactions/createJournal"
import paymentValidation from "@/app/api/lib/validation/createPaymentValidation"
import { Payment } from "@/app/api/mongoose/model/Payment"
import { User } from "@/app/api/mongoose/model/User"

export const createPayment = async (body: any) => {
   try {

      const validate = paymentValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const payment = new Payment(validate.data)
      const customer = await User.findById(payment.customer)

      await payment.save()
      await createJournal({
         amount: payment.amount,
         date: payment.date,
         paid_from_account: "65c0c17289eed83404adf657",
         paid_to_account: payment.payment_mode == 'Settlement' ? '65cd7476657e2fa217255476' : "65b88a8880a3b3419a5804ea",
         type: payment.payment_mode == 'Settlement' ? 'Settlement' : "Customer Payment",
         customer_id: payment.customer,
         reference: `MRC_No: ${payment.receipt_no}`,
         ref_id: payment._id,
         transaction_details: customer?.user_name
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


