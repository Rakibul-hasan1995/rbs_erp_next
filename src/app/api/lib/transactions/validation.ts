
interface ValidatorError {
   field: string;
   value: string;
}


const transactionValidation = (data: any) => {
   let error: ValidatorError[] = [];
   if (!data.date) {
      error.push({ field: 'date', value: '! date is required' });
   }
   if (!data.paid_from_account) {
      error.push({ field: 'paid_from_account', value: '! paid_from_account is required' });
   }
   if (!data.paid_to_account) {
      error.push({ field: 'paid_to_account', value: '! paid_to_account is required' });
   }
   if (!data.amount) {
      error.push({ field: 'amount', value: '! amount is required' });
   }
   if (!data.type) {
      error.push({ field: 'type', value: '! type is required' });
   }

   return {
      error,
      isValid: error.length === 0,
   };
};

export default transactionValidation;
