import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const updatePurchaseOrderInvoiceValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let invoice: any = {}
   let invoiceItems: any[] = []

   if ('date' in data) {
      const date = new Date(data.date)
      if (!isNaN(date.getTime())) {
         invoice.date = new Date(data.date)
      } else {
         error.push({ field: 'date', value: '! date invalid' });
      }
   }
   // if ('amount' in data) {
   //    invoice.amount = +data.amount
   // }

   if ('status' in data) {
      invoice.status = data.status
   }
   if ('discount' in data) {
      invoice.discount = data.discount
   }
   if ('remarks' in data) {
      invoice.remarks = data.remarks
   }

   if (data?.items?.length) {

      data?.items?.forEach((item: any, index: number) => {
         if (!isValidObjectId(item)) {
            error.push({ field: `items[${index}].order`, value: '! order id invalid' });
         } else {
            invoiceItems.push(item)
            invoice.items = invoiceItems
         }
      });
   }

   return {
      error,
      isValid: error.length === 0,
      data: invoice,
   };
};

export default updatePurchaseOrderInvoiceValidation;
