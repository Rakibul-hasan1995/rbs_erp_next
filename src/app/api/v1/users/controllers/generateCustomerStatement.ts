import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Payment } from "@/app/api/mongoose/model/Payment";
import { User } from "@/app/api/mongoose/model/User";
import { _arrSum } from "@/v1/utils/arrSum";
import moment from "moment";
import mongoose from "mongoose";

interface Response {
   code: number;
   message?: string;
   data: any;
   error?: any
}

interface Row {
   date: string;
   particulars: string;
   page: string;
   debit: number;
   credit: number;
}

export const getStatementByUserId = async (id: string): Promise<Response> => {
   try {

      const customerId = new mongoose.Types.ObjectId(id)
      const errResponse = {
         code: 400,
         message: 'Bad Request',
         data: [{ field: '_id', value: 'Please Provide Valid _id' }]
      }
      const customer = await User.findById(id)
      if (!customer) {
         return errResponse
      }

      const invoices = await Invoice.find({ customer: customerId });
      const payments = await Payment.find({ customer: customerId });

      const inv = [];
      const pay = [];

      for (let index = 0; index < invoices.length; index++) {
         const element = invoices[index];
         let data: Row = {
            date: element.date.toISOString(),
            particulars: `Bill - ${element.customer_bill_no}`,
            page: element.invoice_no,
            debit: element.amount,
            credit: 0,
         };
         inv.push(data);
      }



      for (let index = 0; index < payments.length; index++) {
         const element = payments[index];
         let data: Row = {
            date: element.date.toISOString(),
            particulars: element.payment_mode,
            page: element.receipt_no,
            debit: 0,
            credit: element.amount,
         };
         // console.log(data)
         pay.push(data);
      }

      const data = inv.concat(pay);

      const minDate = data.reduce((min, obj) => {
         const currentDate = new Date(obj.date);
         return currentDate < min ? currentDate : min;
      }, new Date(data[0].date));

      let sortedDates = data.sort((a, b) => moment(a.date).diff(moment(b.date)));

      if (customer?.opening_balance) {
         sortedDates.unshift({
            date: minDate.toISOString(),
            particulars: `Opening Balance`,
            page: "BF",
            debit: customer?.opening_balance,
            credit: 0,
         });
      }

      const debitAmount = _arrSum(sortedDates, "debit");
      const creditAmount = _arrSum(sortedDates, "credit");
      const deuAmount = debitAmount - creditAmount;
      console.log({ debitAmount })
      const value = {
         debitAmount,
         creditAmount,
         deuAmount,
         data: sortedDates,
         customer: customer.user_name,
      };

      const response = {
         code: 200,
         data: value
      }
      return response

   } catch (error) {
      console.log(error)
      return {
         code: 500,
         data: null,
         error: error,
         message: 'internal server error',
      }
   }
}