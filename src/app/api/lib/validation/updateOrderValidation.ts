import { isValidObjectId } from "mongoose"
import { currency, itemUnits, orderStatus } from "../../mongoose/model/appConfig";

interface ValidatorError {
   field: string;
   value: string;

}


export const updateOrderValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let updates: any = {};

   if ('customer' in data) {
      updates.customer = data.customer
      if (!isValidObjectId(data.customer)) {
         error.push({ field: 'customer', value: '! customer invalid' })
      }
   }
   if ('order_name' in data) {
      updates.order_name = data.order_name
      if (data.order_name.length < 2) {
         error.push({ field: 'order_name', value: '! Invalid Input' })
      }
   }
   if ('program_name' in data) {
      updates.program_name = data.program_name
      if (data.program_name.length < 2 || data.program_name.length > 15) {
         error.push({ field: 'program_name', value: '! Invalid Input' })
      }
   }
   if ('qty' in data) {
      updates.qty = +data.qty
      if (data.qty < 1) {
         error.push({ field: 'qty', value: '! Invalid Input' })
      }
   }
   if ('rate' in data) {
      updates.rate = +data.rate
      if (data.rate.length < 0) {
         error.push({ field: 'rate', value: '! Invalid Input' })
      }
   }
   if ('currency' in data) {
      updates.currency = data.currency
      const x = currency.find((item) => item == data.currency)
      if (!x?.length) {
         error.push({ field: 'currency', value: '! Invalid Input' })
      }
   }
   if ('unit' in data) {
      updates.unit = data.unit
      const x = itemUnits.find((item) => item == data.unit)
      if (!x?.length) {
         error.push({ field: 'unit', value: '! Invalid Input' })
      }
   }
   if ('stitching' in data) {
      updates.stitching = data.stitching
   }
   if ('tags' in data) {
      updates.tags = data.tags
   }
   if ('description' in data) {
      updates.description = data.description
   }
   if ('order_date' in data) {
      updates.order_date = new Date(data.order_date)
   }
   if ('shipment_date' in data) {
      updates.shipment_date = new Date(data.shipment_date)
   }
   if ('status' in data) {
      updates.status = data.status
      const x = orderStatus.find((item) => item == data.status)
      if (!x?.length) {
         error.push({ field: 'status', value: '! Invalid Input' })
      }
   }
   if ('image_gallery' in data) {
      updates.image_gallery = data.image_gallery
   }
   if ('cover_photo' in data) {
      updates.cover_photo = data.cover_photo
   }
   return {
      error,
      isValid: error.length === 0,
      updates
   };
}