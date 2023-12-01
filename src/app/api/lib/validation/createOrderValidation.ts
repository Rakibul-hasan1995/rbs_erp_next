import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string
}

const orderValidator = (data: any) => {
   let error: ValidatorError[] = []
   if (!data.customer) {
      error.push({ field: 'customer', value: '! customer is required' })
   } else if (!isValidObjectId(data.customer)) {
      error.push({ field: 'customer', value: '! invalid customer' })
   }
   if (data.order_name < 3) {
      error.push({ field: 'order_name', value: '! order name is required' })
   }
   if (!data.rate) {
      error.push({ field: 'rate', value: '! rate is required' })
   }
   return {
      error,
      isValid: error.length === 0
   }
}
export default orderValidator
