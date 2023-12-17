import { DeliveryChallan, ReceiveChallan } from "@/app/api/mongoose/model/Challan";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";






export interface PurchaseOrderInvoiceExpandItem {
   _id: string;
   order: {
      program_name: string;
      order_name: string;
      unit: 'Pcs' | "Dzn";
      currency: "USD" | "BDT";
      cover_photo: {
         _id: string;
         href: string
      };
   }
   qty: number;
   rate: number;
   challan_no?: string
   totalUsd: number;
   totalBdt: number;
   description: string;
   order_date: string;
   shipment_date: string;
}

interface Cover_photoExpand {
   _id: string;
   href: string
}

export interface PurchaseOrderInvoiceExpand {
   amount: number;
   cover_photo: Cover_photoExpand;
   date: string;
   discount: number;
   invoice_no: string;
   items: PurchaseOrderInvoiceExpandItem[];
   supplier: {
      _id: string;
      user_name: string,
      exchange_rate: number;
      contact_details: {
         address: string
      }
   };
   supplier_bill_no: number;
   status: string;
   supplier_prev_deu: number;
   remarks: string;
   totalAmountBDT: number;
   totalAmountUSD: number;
   discountAmount: number;
   totalQty: number;
}
export const getPurchaseOrderInvoiceById = async (id: string, expand: boolean,) => {
   try {

      let invoice = PurchaseOrderInvoice.findById(id)
         .populate('supplier', 'user_name contact_details exchange_rate')
         .populate('cover_photo', 'href')
      if (expand) {
         invoice
            .populate({
               path: 'items',
               select: 'order order_date qty rate',
               populate:
               {
                  path: 'order',
                  select: 'order_name program_name unit cover_photo currency',
                  populate: {
                     path: 'cover_photo',
                     select: 'href'
                  }
               },
            }
            )
      }

      const data: any = await invoice.exec()

      const calculateTotalUsd = (order: any) => {
         const { qty, rate, currency } = order
         if (currency == 'USD') {
            const amount = qty / 12 * rate
            return amount
         } else {
            return 0
         }
      }

      const calculateTotalBDT = (order: any) => {
         const { qty, rate, currency } = order
         const exchange_rate = +data?.supplier?.exchange_rate || 85
         if (currency == 'USD') {
            const amount = ((qty / 12) * rate) * exchange_rate
            return amount
         } else {
            return (qty * rate)
         }
      }


      let items = []
      if (data?.items.length) {
         for (let i = 0; i < data?.items?.length; i++) {
            const customer_id = data.supplier._id

            const element: any = data.items[i].order;
            const item = data.items[i]
            const challan = await ReceiveChallan.find({ 'items.order': { $in: element._id }, 'customer': customer_id });
            const challanNos = challan?.map(challan => challan.challan_no).join(", ");

            const obj = {
               ...element.toObject(),
               qty: item.qty,
               rate: item.rate,
               order_date: item.order_date,
               challan_no: challanNos,
               totalUsd: calculateTotalUsd({ rate: item.rate, qty: item.qty, currency: element.currency }),
               totalBdt: calculateTotalBDT({ rate: item.rate, qty: item.qty, currency: element.currency })
            };
            items.push(obj)
         }
      }

      const inv = {
         ...data?.toObject(),
         items
      }
      inv.totalAmountBDT = inv.items.reduce(
         (total: any, item: any) => total + item.totalBdt,
         0
      );
      inv.totalAmountUsd = inv.items.reduce(
         (total: any, item: any) => total + item.totalUsd,
         0
      );
      inv.totalQty = inv.items.reduce(
         (total: any, item: any) => total + item.qty,
         0
      );
      const discountAmount = (inv.totalAmountBDT * inv.discount) / 100;
      inv.discountAmount = discountAmount
      inv.totalAmountBDT = inv.totalAmountBDT - discountAmount

      if (inv.amount !== inv.totalAmountBDT) {
         await Invoice.findByIdAndUpdate(inv._id, { amount: inv.totalAmountBDT })
         inv.amount = inv.totalAmountBDT
      }

      return {
         code: 200,
         data: inv,
      }
   } catch (error: any) {
      console.log(error)
      return {
         code: 500, message: error.message, error
      }
   }
};


















// import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";
// import '@/app/api/mongoose/model/User'
// import '@/app/api/mongoose/model/Order'

// export const getPurchaseOrderInvoiceById = async (id: string) => {
//    try {
//       let challan = PurchaseOrderInvoice.findById(id)
//          .populate('supplier', 'user_name')
//          .populate({
//             path: 'items',
//             // select: 'order_name program_name unit cover_photo rate qty',
//             populate:
//             {
//                path: 'order',
//                select: 'order_name program_name unit cover_photo',
//                populate: {
//                   path: 'cover_photo'
//                }
//             },
//          }
//          )

//       const data = await challan.exec()


//       return {
//          code: 200,
//          data,
//       }
//    } catch (error: any) {
//       return {
//          code: 500, message: error.message, error
//       }
//    }
// };

