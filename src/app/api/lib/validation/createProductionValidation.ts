import { isValidObjectId } from "mongoose";
import { shifts } from "../../mongoose/model/appConfig";

interface ValidatorError {
   field: string;
   value: string;
}

const productionValidate = (data: any) => {
   let error: ValidatorError[] = [];

   const shiftValid = shifts.find((item) => item === data.shift);

   if (!data.date) {
      error.push({ field: 'date', value: '! date is required' });
   }
   if (!data.shift) {
      error.push({ field: 'shift', value: '! shift is required' });
   } else if (!shiftValid?.length) {
      error.push({ field: 'shift', value: '! shift invalid' });
   }
   if (!data.total_amount) {
      error.push({ field: 'total_amount', value: '! total_amount is required' });
   }

   // Include validation checks for production_data fields (assuming they are arrays)
   if (!data.production_data || data.production_data.length === 0) {
      error.push({ field: 'production_data', value: '! production_data is required' });
   } else {

      // Validate each item in the production_data array
      data?.production_data?.forEach((item: any, index: number) => {

         if (!isValidObjectId(item.order)) {
            error.push({ field: `production_data[${index}].order`, value: '! order id invalid' });
         }
         if (item.qty === undefined || item.qty === null) {
            error.push({ field: `production_data[${index}].qty`, value: '! qty is required' });
         }
         if (!item.machine_no) {
            error.push({ field: `production_data[${index}].machine_no`, value: '! machine_no is required' });
         }
         // if (!isValidObjectId(item.operator)) {
         //    error.push({ field: `production_data[${index}].operator`, value: '! operator id invalid' });
         // }
         // if (!isValidObjectId(item.assistant_operator)) {
         //    error.push({ field: `production_data[${index}].assistant_operator`, value: '! assistant_operator id invalid' });
         // }
      });
   }

   return {
      error,
      isValid: error.length === 0,
   };
};

export default productionValidate;
