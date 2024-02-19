
import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { DeliveryChallan, ReceiveChallan } from "@/app/api/mongoose/model/Challan";
import { Order } from "@/app/api/mongoose/model/Order";
import { Production } from "@/app/api/mongoose/model/Production";
import "@/app/api/mongoose/model/User";
import mongoose, { Query } from "mongoose";
import '@/app/api/mongoose/model/Gallery'


export const queryOrder = async (url: string, query: any) => {
   try {
      const page = getQueryParams(url as string, 'page', 1);
      const limit = getQueryParams(url as string, 'limit', 10)
      const sortType = getQueryParams(url as string, 'sort_type', 'desc')
      const sortKey = getQueryParams(url as string, 'sort_key', 'program_name')
      const expand = getQueryParams(url as string, 'expand', false)
      
      const skip = (page - 1) * limit;
      console.log({ page })
      const orders = Order.find(query)
         .skip(skip)
         .limit(limit)
         .sort({ [sortKey]: sortType })
         .populate('cover_photo', 'href')
         .populate('customer', 'user_name exchange_rate')

      let data
      let recData: { [x: string]: any; }
      let delData: { [x: string]: any; }
      let prodData: { [x: string]: any; }


      if (expand) {
         data = (await orders.exec()).filter(order => order.customer)
         const orderIds = data.map((item) => { return new mongoose.Types.ObjectId(item._id) })

         //  generate Rec Qty ======>
         const recChalan = await ReceiveChallan.aggregate([
            {
               $unwind: '$items',
            },
            {
               $match: {
                  'items.order': { $in: orderIds }, // Define orderIds as an array of order IDs to be queried
               },
            },
            {
               $group: {
                  _id: '$items.order',
                  receive_qty: { $sum: '$items.qty' },
               },
            },
         ]);

         recData = recChalan.reduce((result, item) => {
            result[item._id] = item.receive_qty;
            return result;
         }, {});
         //  generate Rec Qty <======

         //  generate Delivery Qty ======>
         const delChalan = await DeliveryChallan.aggregate([
            {
               $unwind: '$items',
            },
            {
               $match: {
                  'items.order': { $in: orderIds }, // Define orderIds as an array of order IDs to be queried
               },
            },
            {
               $group: {
                  _id: '$items.order',
                  delivery_qty: {
                     $sum: {
                        $add: [
                           '$items.qty',
                           '$items.emb_reject_qty',
                           '$items.fabric_reject_qty',
                        ],
                     }
                  },
               },
            },
         ]);

         delData = delChalan.reduce((result, item) => {
            result[item._id] = item.delivery_qty;
            return result;
         }, {});
         //  generate Delivery Qty <======

         //  generate Delivery Qty ======>
         const production = await Production.aggregate([
            {
               $unwind: '$production_data',
            },
            {
               $match: {
                  'production_data.order': { $in: orderIds }, // Define orderIds as an array of order IDs to be queried
               },
            },
            {
               $group: {
                  _id: '$production_data.order',
                  production_qty: { $sum: '$production_data.qty' },
               },
            },
         ]);

         prodData = production.reduce((result, item) => {
            result[item._id] = item.production_qty;
            return result;
         }, {});
         //  generate Delivery Qty <======


         data = data.map((order) => {
            const orderData = { ...order.toObject() };
            return {
               ...orderData,
               receive_qty: recData[order._id] || 0,
               delivery_qty: delData[order._id] || 0,
               production_qty: prodData[order._id] || 0
            };
         });

      } else {
         orders.select('-image_gallery')

         data = (await orders.exec()).filter(order => order.customer)
      }

      // const count = data.length
      const count = await Order.countDocuments(query)
      const pagination = generatePagination(page, limit, count)

      const response = {
         code: 200,
         data,
         pagination,
      };

      return response
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
};
