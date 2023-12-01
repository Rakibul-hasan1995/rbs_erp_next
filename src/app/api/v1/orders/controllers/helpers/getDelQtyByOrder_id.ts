import { DeliveryChallan } from "@/app/api/mongoose/model/Challan";
import mongoose from "mongoose";

interface DeliveryInfo {
   total_qty: number;
   delivery_qty: number;
   emb_reject_qty: number;
   fabric_reject_qty: number;
}

export const getDelQtyBYOrderId = async (orderId: string): Promise<DeliveryInfo> => {
   const delChalanArr = await DeliveryChallan.aggregate([
      {
         $unwind: '$items',
      },
      {
         $match: {
            'items.order': new mongoose.Types.ObjectId(orderId),
         },
      },
      {
         $group: {
            _id: '$items.order',
            total_qty: {
               $sum: {
                  $add: [
                     '$items.qty',
                     '$items.emb_reject_qty',
                     '$items.fabric_reject_qty',
                  ],
               },
            },
            delivery_qty: { $sum: '$items.qty' },
            emb_reject_qty: { $sum: '$items.emb_reject_qty' },
            fabric_reject_qty: { $sum: '$items.fabric_reject_qty' },
         },
      },
   ]);
   if (delChalanArr.length === 0) {
      const obj: DeliveryInfo = {
         total_qty: 0,
         delivery_qty: 0,
         emb_reject_qty: 0,
         fabric_reject_qty: 0
      }
      return obj
   }

   const deliveryInfo: DeliveryInfo = delChalanArr[0];
   return deliveryInfo;

};
