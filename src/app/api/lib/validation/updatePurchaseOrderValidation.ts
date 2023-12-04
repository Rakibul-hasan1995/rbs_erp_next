import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const updatePurchaseOrderValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let docs: any = {}

   if ('supplier' in data) {
      if (!isValidObjectId(data.supplier)) {
         error.push({ field: 'supplier', value: '! supplier id invalid' });
      } else {
         docs.supplier = data.supplier
      }
   }
   if ('order' in data) {
      if (!isValidObjectId(data.order)) {
         error.push({ field: 'order', value: '! order id invalid' });
      } else {
         docs.order = data.order
      }
   }

   if ('qty' in data) {
      docs.qty = data.qty
   }
   if ('rate' in data) {
      docs.rate = +data.rate
   }

   if ('description' in data) {
      docs.description = data.description
   }

   if ('order_date' in data) {
      const date = new Date(data.order_date)
      if (!isNaN(date.getTime())) {
         docs.order_date = date
      }
   }

   if ('shipment_date' in data) {
      const date = new Date(data.shipment_date)
      if (!isNaN(date.getTime())) {
         docs.shipment_date = date
      }
   }
   if ('status' in data) {
      docs.status = data.status
   }

   return {
      error,
      isValid: error.length === 0,
      data: docs
   };
};

export default updatePurchaseOrderValidation;
