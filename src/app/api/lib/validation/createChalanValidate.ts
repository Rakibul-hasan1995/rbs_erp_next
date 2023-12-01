import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const challanValidate = (data: any) => {
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

   if ('customer' in data) {
      if (!isValidObjectId(data.customer)) {
         error.push({ field: 'customer', value: '! customer id invalid' });
      } else {
         challan.customer = data.customer
      }
   } else {
      error.push({ field: 'customer', value: '! customer id is required' });
   }

   if ('challan_no' in data) {
      if (data.challan_no) {
         challan.challan_no = data.challan_no
      } else {
         error.push({ field: 'challan_no', value: '! challan no is required' })
      }
   } else {
      error.push({ field: 'challan_no', value: '! challan no is required' })
   }

   if ('bag_qty' in data) {
      challan.bag_qty = +data.bag_qty
   }
   if ('remarks' in data) {
      challan.remarks = data.remarks
   }

   if (!data.items || data.items.length === 0) {
      error.push({ field: 'items', value: '! items is required' });
   } else {
      let challanItems: any[] = []
      data?.items?.forEach((item: any, index: number) => {
         let itemData: any = {}
         if ('order' in item) {
            if (!isValidObjectId(item.order)) {
               error.push({ field: `items[${index}].order`, value: '! order id invalid' });
            } else {
               itemData.order = item.order
            }
         }
         if ('qty' in item) {
            if (item.qty <= 0) {
               error.push({ field: `items[${index}].qty`, value: '! qty invalid' });
            } else {
               itemData.qty = +item.qty
            }
         }
         if ('emb_reject_qty' in item) {
            itemData.emb_reject_qty = +item.emb_reject_qty
         }
         if ('fabric_reject_qty' in item) {
            itemData.fabric_reject_qty = +item.fabric_reject_qty
         }
         if ('remarks' in item) {
            itemData.remarks = item.remarks
         }
         challanItems.push(itemData)
      });
      challan.items = challanItems
   }

   return {
      error,
      isValid: error.length === 0,
      data: challan
   };
};

export default challanValidate;
