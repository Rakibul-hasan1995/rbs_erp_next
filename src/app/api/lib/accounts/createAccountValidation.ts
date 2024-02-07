

interface ValidatorError {
   field: string;
   value: string
}



export const accountValidation = (data: any) => {
   let error: ValidatorError[] = []

   if (!data.account_name) {
      error.push({ field: 'account_name', value: '! account name is required' })
   }


   return {
      error,
      isValid: error.length === 0
   }
}