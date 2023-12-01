import { Payment } from "@/app/api/mongoose/model/Payment";
import '@/app/api/mongoose/model/User'
export const getPaymentById = async (id: string,) => {
   try {
      let payment = Payment.findById(id)
         .populate('customer', 'user_name')
      const data = await payment.exec()

      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      return {
         error,
         code: 500,
         message: error.message
      }
   }
};

