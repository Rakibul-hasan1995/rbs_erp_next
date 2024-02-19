import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Payment } from "@/app/api/mongoose/model/Payment";
import { User } from "@/app/api/mongoose/model/User";
import { ExtendCustomer } from "@/types/customers";
import { CustomerBalanceSummaryApiResponse } from "@/types/report";
import { numberWithCommas } from "@/v1/utils/numberFormater";
import mongoose from "mongoose";



type CustomerBalanceSummary = (ids: mongoose.Types.ObjectId[]) => Promise<ExtendCustomer[]>
export const customerBalanceSummary: CustomerBalanceSummary = async (ids: mongoose.Types.ObjectId[]) => {
   try {
      const customers = await User.find({ _id: { $in: ids } })
      const customersIds = customers.map((item) => item._id)

      //  generate payment amount ======>
      const payment = await Payment.aggregate([
         {
            $match: {
               'customer': { $in: customersIds }, // Define orderIds as an array of order IDs to be queried
               "payment_mode": { $ne: 'Settlement' }
            },
         },
         {
            $group: {
               _id: '$customer',
               amount: { $sum: '$amount' },
            },
         },
      ]);
      const paymentsData = payment.reduce((result, item) => {
         result[item._id] = item.amount;
         return result;
      }, {});
      //  generate payment amount <======
      //  generate settlement amount ======>
      const settlement = await Payment.aggregate([
         {
            $match: {
               'customer': { $in: customersIds }, // Define orderIds as an array of order IDs to be queried
               "payment_mode": 'Settlement'
            },
         },
         {
            $group: {
               _id: '$customer',
               amount: { $sum: '$amount' },
            },
         },
      ]);

      const settlementData = settlement.reduce((result, item) => {
         result[item._id] = item.amount;
         return result;
      }, {});
      //  generate settlement amount <======

      //  generate Invoice amount ======>
      const invoice = await Invoice.aggregate([
         {
            $match: {
               'customer': { $in: customersIds }, // Define orderIds as an array of order IDs to be queried
            },
         },
         {
            $group: {
               _id: '$customer',
               amount: { $sum: '$amount' },
            },
         },
      ]);


      const invoiceData = invoice.reduce((result, item) => {
         result[item._id] = item.amount;
         return result;
      }, {});
      //  generate Invoice amount <======

      let data = customers.map((item) => {

         const payment = paymentsData[item._id] || 0
         const invoice = item.opening_balance ? invoiceData[item._id] + item.opening_balance : invoiceData[item._id]
         const settlement = settlementData[item._id] || 0
         const closing = invoice - (payment + settlement)
         const res: ExtendCustomer = {
            _id: item._id,
            email: item.email,
            contact_details: item.contact_details,
            status: item.status,
            name: item.user_name,
            payment_amount: payment,
            invoice_amount: invoice,
            settlement_amount: settlement,
            payment_amount_formatted: numberWithCommas(payment),
            invoice_amount_formatted: numberWithCommas(invoice),
            settlement_amount_formatted: numberWithCommas(settlement),
            closing_amount: +closing.toFixed(2),
            closing_amount_formatted: numberWithCommas(closing)
         }
         return res
      })

      // data = data.sort((a, b) => (b.closing_amount - a.closing_amount));


      return data

   } catch (error: any) {
      throw error
   }
}
