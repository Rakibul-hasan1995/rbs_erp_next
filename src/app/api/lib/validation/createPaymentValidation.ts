import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const paymentValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let docs: any = {}

   if ('customer' in data) {
      if (!isValidObjectId(data.customer)) {
         error.push({ field: 'customer', value: '! customer id invalid' });
      } else {
         docs.customer = data.customer
      }
   } else {
      error.push({ field: 'customer', value: '! customer id is required' });
   }

   if ('date' in data) {
      const date = new Date(data.date)
      if (!isNaN(date.getTime())) {
         docs.date = new Date(data.date)
      } else {
         error.push({ field: 'date', value: '! date invalid' });
      }
   } else {
      error.push({ field: 'date', value: '! date is required' });
   }



   if ('receipt_no' in data) {
      if (data.receipt_no) {
         docs.receipt_no = data.receipt_no
      } else {
         error.push({ field: 'receipt_no', value: '! receipt_no no is required' })
      }
   } else {
      error.push({ field: 'receipt_no', value: '! receipt_no no is required' })
   }
   if ('invoice' in data) {
      docs.invoice = data.invoice
   }
   if ('received_by' in data) {
      docs.received_by = data.received_by
   }
   if ('amount' in data) {
      docs.amount = +data.amount
   } else {
      error.push({ field: 'amount', value: "amount is required" })
   }

   if ('payment_mode' in data) {
      docs.status = data.status
   } else {
      docs.status = 'Cash'
   }

   if ('description' in data) {
      docs.description = data.description
   }
   if ('cheque_info' in data) {
      docs.cheque_info = {}
      const info = data.cheque_info
      if ('cheque_date' in info) {
         docs.cheque_info.cheque_date = info.cheque_date
      } else {
         error.push({ field: 'cheque_date', value: '! cheque Date is required' })
      }
      if ('bank_name' in info) {
         docs.cheque_info.bank_name = info.bank_name
      } else {
         error.push({ field: 'bank_name', value: '! bank name is required' })
      }
      if ('cheque_no' in info && info.cheque_no.length) {
         docs.cheque_info.cheque_no = info.cheque_no
      } else {
         error.push({ field: 'cheque_info.cheque_no', value: '! cheque no is required' })
      }
      if ('branch_name' in info) {
         docs.cheque_info.branch_name = data.branch_name
      }
   }

   return {
      error,
      isValid: error.length === 0,
      data: docs
   };
};

export default paymentValidation;
