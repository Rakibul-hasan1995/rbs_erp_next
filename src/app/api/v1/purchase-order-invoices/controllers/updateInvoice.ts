import updatePurchaseOrderInvoiceValidation from "@/app/api/lib/validation/updatePurchaseOrderInvoiceValidation";
import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";

export const updatePurchaseOrderInvoice = async (id : string, body: any) => {
   try {
      const invoice = await PurchaseOrderInvoice.findById(id)
      if (!invoice) {
         return {
            code: 400,
            message: 'invoice not found'
         }
      }

      const validate = updatePurchaseOrderInvoiceValidation(body);

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
         code: 500, message: error.message, error
      }
   }
}