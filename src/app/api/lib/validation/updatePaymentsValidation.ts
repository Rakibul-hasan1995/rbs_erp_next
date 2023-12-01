
interface ValidatorError {
   field: string;
   value: string;
}

const updatePaymentValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let docs: any = {}

   if ('date' in data) {
      const date = new Date(data.date)
      if (!isNaN(date.getTime())) {
         docs.date = new Date(data.date)
      } else {
         error.push({ field: 'date', value: '! date invalid' });
      }
   }
   if ('customer' in data) {
      docs.customer = data.customer
   }

   if ('receipt_no' in data) {
      if (data.receipt_no) {
         docs.receipt_no = data.receipt_no
      } else {
         error.push({ field: 'receipt_no', value: '! receipt_no no is required' })
      }
   }
   if ('invoice' in data) {
      docs.invoice = data.invoice
   }
   if ('received_by' in data) {
      docs.received_by = data.received_by
   }
   if ('amount' in data) {
      docs.amount = +data.amount
   }

   if ('payment_mode' in data) {
      docs.payment_mode = data.payment_mode
   }

   if ('description' in data) {
      docs.description = data.description
   }
   if ('cheque_info' in data) {
      docs.cheque_info = {}
      const info = data.cheque_info
      if ('cheque_date' in info) {
         docs.cheque_info.cheque_date = info.cheque_date
      }
      if ('bank_name' in info) {
         docs.cheque_info.bank_name = info.bank_name
      }
      if ('cheque_no' in info) {
         docs.cheque_info.cheque_no = info.cheque_no
      }
      if ('branch_name' in info) {
         docs.cheque_info.branch_name = info.branch_name
      }
      if ('image' in info) {
         docs.cheque_info.image = data.image
      }
   }

   return {
      error,
      isValid: error.length === 0,
      data: docs
   };
};

export default updatePaymentValidation;
