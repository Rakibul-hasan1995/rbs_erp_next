import { isValidObjectId } from "mongoose";
import { shifts } from "../../mongoose/model/appConfig";
import { ProductionDataDocument } from "../../mongoose/model/Production";

interface ValidatorError {
   field: string;
   value: string;
}

const productionUpdateValidate = (data: any) => {
   let error: ValidatorError[] = [];
   let updates: any = {};

   // Check if the 'shift' field is being updated and validate it
   if ('shift' in data) {
      updates.shift = data.shift
      const shiftValid = shifts.find((item) => item === data.shift);
      if (!shiftValid?.length) {
         error.push({ field: 'shift', value: '! shift invalid' });
      }

   }
   // Check if the 'date' field is being updated and validate it
   if ('date' in data) {
      updates.date = data.date
      if (!data.date) {
         error.push({ field: 'date', value: '! date is required' });
      }
      // Add further validation rules for 'date' if needed
   }

   // Check if the 'total_amount' field is being updated and validate it
   if ('total_amount' in data) {
      updates.total_amount = data.total_amount
      if (!data.total_amount) {
         error.push({ field: 'total_amount', value: '! total_amount is required' });
      }
      // Add further validation rules for 'total_amount' if needed
   }

   // Check if the 'qty' field is being updated and validate it
   if ('qty' in data) {
      updates.qty = data.qty
      if (data.qty === undefined || data.qty === null) {
         error.push({ field: 'qty', value: '! qty is required' });
      }
      // Add further validation rules for 'qty' if needed
   }

   // Check if the 'production_data' field is being updated and validate it
   if ('production_data' in data) {
      console.log(data)
      updates.production_data = data.production_data
      const productionDataValidation = validateProductionData(data.production_data);
      if (!productionDataValidation.isValid) {
         error = error.concat(productionDataValidation.error);
      }
   }

   // Include validation checks for other fields that may be updated dynamically

   return {
      error,
      updates,
      isValid: error.length === 0,
   };
};

export default productionUpdateValidate;


const validateProductionData = (data: ProductionDataDocument[]) => {
   let error: ValidatorError[] = [];

   // Iterate through each item in the production_data array and validate it
   data?.forEach((item, index) => {
      if (!item._id) {
         error.push({ field: `production_data[${index}].order`, value: '! sub data id is required' });
      }
      if ('order' in item) {
         if (!isValidObjectId(item.order)) {
            error.push({ field: `order ${item._id}`, value: '! order id invalid' });
         }
      }
      if ('qty' in item) {
         if (item.qty <= 0) {
            error.push({ field: `qty ${item._id}`, value: '! qty id required' });
         }
      }
      if ('machine_no' in item) {
         if (!item.machine_no) {
            error.push({ field: 'machine_no', value: '! machine_no invalid' });
         }
      }
      if ('operator' in item) {
         if (!isValidObjectId(item.operator)) {
            error.push({ field: `operator ${item._id}`, value: '! operator id required' });
         }
      }
      if ('assistant_operator' in item) {
         if (!isValidObjectId(item.assistant_operator)) {
            error.push({ field: 'assistant_operator', value: '! assistant_operator id invalid' });
         }
      }
      if ('helper' in item) {
         if (!isValidObjectId(item.helper)) {
            error.push({ field: 'helper', value: '! helper id invalid' });
         }
      }


   });

   return {
      error,
      isValid: error.length === 0,
   };
};


