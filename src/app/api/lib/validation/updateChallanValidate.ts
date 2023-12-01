import { isValidObjectId } from "mongoose";

interface ValidatorError {
   field: string;
   value: string;
}

const updateChallanValidate = (data: any) => {
   let error: ValidatorError[] = [];
   let challan: any = {}
   let challanItems: any[] = []


   if ('date' in data) {
      const date = new Date(data.date)
      if (!isNaN(date.getTime())) {
         challan.date = new Date(data.date)
      } else {
         error.push({ field: 'date', value: '! date invalid' });
      }
   }
   if ('customer' in data) {
      if (!isValidObjectId(data.customer)) {
         error.push({ field: 'customer', value: '! customer id invalid' });
      } else {
         challan.customer = data.customer
      }
   }

   if ('challan_no' in data) {
      if (data.challan_no) {
         challan.challan_no = data.challan_no
      } else {
         error.push({ field: 'challan_no', value: '! challan no is required' })
      }
   }

   if ('bag_qty' in data) {
      challan.bag_qty = +data.bag_qty
   }
   if ('remarks' in data) {
      challan.remarks = data.remarks
   }

   if (data.items) {

      data?.items?.forEach((item: any, index: number) => {
         let itemData: any = {}
         // if (!item._id) {
         //    error.push({ field: `items[${index}]._id`, value: '! item _id is required' });
         // } else if (!isValidObjectId(item._id)) {
         //    error.push({ field: `items[${index}]._id`, value: '! item _id invalid' });
         // } else {
         //    itemData._id = item._id
         // }
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
   }

   return {
      error,
      isValid: error.length === 0,
      data: { ...challan, items: [...challanItems] },
      items: challanItems
   };
};

export default updateChallanValidate;
