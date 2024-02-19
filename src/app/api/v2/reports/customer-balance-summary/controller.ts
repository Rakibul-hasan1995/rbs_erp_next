import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Payment } from "@/app/api/mongoose/model/Payment";
import { User } from "@/app/api/mongoose/model/User";
import { CustomerBalanceSummaryApiResponse } from "@/types/report";
import { numberWithCommas } from "@/v1/utils/numberFormater";

export const customerBalanceSummaryApiResponse = async () => {
   try {
      const customers = await User.find({roll: "customer"})
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

      const data = customers.map((item) => {

         const payment = paymentsData[item._id] || 0
         const invoice = item.opening_balance ? invoiceData[item._id] + item.opening_balance : invoiceData[item._id] 
         const settlement = settlementData[item._id] || 0
         const closing = invoice - (payment + settlement)
         const res = {
            _id: item._id,
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

      let sortedData = data.sort((a, b) => (b.closing_amount - a.closing_amount));

      const res: CustomerBalanceSummaryApiResponse = {
         data: sortedData,
         code: 200,
      }

      return res

   } catch (error: any) {
      return { message: error.message, code: 500 }
   }
}
