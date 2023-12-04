import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const purchaseOrderInvoiceValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let challan: any = {}

   if ('date' in data) {
      const date = new Date(data.date)
      if (!isNaN(date.getTime())) {
         challan.date = new Date(data.date)
      } else {
         error.push({ field: 'date', value: '! date invalid' });
      }
   } else {
      error.push({ field: 'date', value: '! date is required' });
   }

   if ('supplier' in data) {
      if (!isValidObjectId(data.supplier)) {
         error.push({ field: 'supplier', value: '! supplier id invalid' });
      } else {
         challan.supplier = data.supplier
      }
   } else {
      error.push({ field: 'supplier', value: '! supplier id is required' });
   }

   // if ('invoice_no' in data) {
   //    if (data.invoice_no) {
   //       challan.invoice_no = data.invoice_no
   //    } else {
   //       error.push({ field: 'invoice_no', value: '! challan no is required' })
   //    }
   // } else {
   //    error.push({ field: 'invoice_no', value: '! challan no is required' })
   // }

   // if ('amount' in data) {
   //    challan.amount = +data.amount
   // } else {
   //    error.push({ field: 'amount', value: "amount is required" })
   // }

   if ('status' in data) {
      challan.status = data.status
   } else {
      challan.status = 'created'
   }
   if ('discount' in data) {
      challan.discount = data.discount
   } else {
      challan.status = 0
   }
   if ('remarks' in data) {
      challan.remarks = data.remarks
   } else {
      challan.remarks = ''
   }
   // if ('supplier_prev_deu' in data) {
   //    challan.supplier_prev_deu = +data.supplier_prev_deu
   // } else {
   //    challan.supplier_prev_deu = 0
   // }

   if (!data.items || data.items.length === 0) {
      error.push({ field: 'items', value: '! items is required' });
   } else {
      let invoiceItems: any[] = []
      data?.items?.forEach((item: any, index: number) => {
         if (!isValidObjectId(item)) {
            error.push({ field: `items[${index}].order`, value: '! order id invalid' });
         } else {
            invoiceItems.push(item)
         }
      });
      challan.items = invoiceItems
   }

   return {
      error,
      isValid: error.length === 0,
      data: challan
   };
};

export default purchaseOrderInvoiceValidation;
