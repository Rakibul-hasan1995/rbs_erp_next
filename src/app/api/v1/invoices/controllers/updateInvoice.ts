import updateInvoiceValidation from "@/app/api/lib/validation/updateInvoiceValidation";
import { Invoice } from "@/app/api/mongoose/model/Invoice";

export const updateInvoice = async (id: string, body: any,) => {
   try {

      const invoice = await Invoice.findById(id)
      if (!invoice) {
         return {
            code: 400,
            message: 'invoice not found'
         }
      }

      const validate = updateInvoiceValidation(body);

      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }

      Object.assign(invoice, validate.data)

      await invoice.save();


      return {
         code: 200,
         data: invoice,
         message: 'Successfully Update Data'
      }


   } catch (error: any) {
      return {
         code: 200,
         message: error.message,
         error
      }
   }

}