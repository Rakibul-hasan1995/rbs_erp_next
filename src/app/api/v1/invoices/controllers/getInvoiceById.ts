import { DeliveryChallan } from "@/app/api/mongoose/model/Challan";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Transaction } from "@/app/api/mongoose/model/transaction";
import { updateTransaction } from "@/app/api/v2/transactions/controllers/updateTransaction";

export const getInvoiceById = async (id: string, expand: boolean,) => {
   try {

      let invoice = Invoice.findById(id)
         .populate('customer', 'user_name contact_details exchange_rate')
      if (expand) {
         invoice
            .populate({
               path: 'items',
               select: 'order_name program_name unit cover_photo rate qty currency',
               populate: [
                  {
                     path: 'cover_photo',
                     select: 'href'
                  },
               ]
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
         const exchange_rate = +data?.customer?.exchange_rate || 85
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
            const customer_id = data.customer._id
            const element: any = data.items[i];
            const deliveryChallan = await DeliveryChallan.find({ 'items.order': { $in: element._id }, 'customer': customer_id });

            const challanNos = deliveryChallan?.map(challan => challan.challan_no).join(", ");
            const obj = {
               ...element.toObject(),
               challan_no: challanNos,
               totalUsd: calculateTotalUsd(element),
               totalBdt: calculateTotalBDT(element)
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

         const transaction = await Transaction.findOne({ ref_id: inv._id })
         if (transaction) {
            await updateTransaction({ amount: inv.totalAmountBDT }, transaction._id)
         }
      }

      return {
         code: 200,
         data: inv,
      }
   } catch (error: any) {
      return {
         code: 500, message: error.message, error
      }
   }
};


interface ResponseDataExpand {
   _id: string;
   customer: {
      _id: string;
      user_name: string,
      exchange_rate: number;
      contact_details: {
         address: string
      }
   }
   date: string;
   invoice_no: string;
   customer_bill_no: number;
   discount: number;
   amount: number;
   status: string;
   customer_prev_deu?: number;
   items: {
      _id: string;
      program_name: string;
      order_name: string;
      qty: number;
      rate: number;
      unit: 'Pcs' | "Dzn";
      currency: "USD" | "BDT";
      cover_photo: {
         _id: string;
         href: string
      };
      challan_no?: string
      totalUsd: number;
      totalBDT: number;

   }[];
   totalAmountBDT: number;
   totalAmountUSD: number;
   discountAmount: number;
   totalQty: number;
   remarks?: string;
}

