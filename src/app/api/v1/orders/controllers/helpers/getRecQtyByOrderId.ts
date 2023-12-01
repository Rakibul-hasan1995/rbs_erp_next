import { ReceiveChallan } from "@/app/api/mongoose/model/Challan";
import mongoose from "mongoose";

interface DeliveryInfo {
   receive_qty: number;
}

export const getRecQtyBYOrderId = async (orderId: string): Promise<DeliveryInfo> => {
   const delChalanArr = await ReceiveChallan.aggregate([
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
            receive_qty: {
               $sum: {
                  $add: [
                     '$items.qty',
                     '$items.emb_reject_qty',
                     '$items.fabric_reject_qty',
                  ],
               },
            },
         },
      },
   ]);
   if (delChalanArr.length === 0) {
      const obj: DeliveryInfo = {
         receive_qty: 0,
      }
      return obj
   }

   const deliveryInfo: DeliveryInfo = delChalanArr[0];
   return deliveryInfo;
};
