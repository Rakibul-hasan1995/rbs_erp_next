import mongoose from "mongoose";

import moment from "moment";
import { TransactionFormatted } from "@/types/transaction";
import { Transaction } from "../../mongoose/model/transaction";
import { numberWithCommas } from "@/v1/utils/numberFormater";


type GetOpeningBalanceRow = (arg: {
   accountId: mongoose.Types.ObjectId;
   startDate: string;
   isDebit?: boolean;
}) => Promise<TransactionFormatted>



export const getAccountOpeningBalanceRow: GetOpeningBalanceRow = async ({ accountId, startDate, isDebit }) => {
   try {
      // Create query object with accountId and date filter (transactions before startDate)
      const transactionQuery: any = { account_id: accountId };
      if (startDate) {
         transactionQuery.date = { $lt: new Date(startDate) };
      }

      // Aggregate transactions before the start date
      const openingBalance = await Transaction.aggregate([
         {
            $match: transactionQuery
         },
         {
            $group: {
               _id: null,
               debit: { $sum: "$debit_amount" },
               credit: { $sum: "$credit_amount" },
            }
         }
      ]);

      const debit = openingBalance[0]?.debit || 0
      const credit = openingBalance[0]?.credit || 0

      const opBalance = isDebit ? debit - credit : credit - debit


      const row: any = {
         date: new Date(startDate),
         account_id: new mongoose.Types.ObjectId(),
         credit_amount: opBalance > 0 ? opBalance : 0,
         debit_amount: opBalance < 0 ? opBalance : 0,
         credit_amount_formatted: opBalance > 0 ? numberWithCommas(opBalance) : '0.00',
         debit_amount_formatted: opBalance < 0 ? numberWithCommas(opBalance) : '0.00',
         type: '',
         transaction_details: `Opening Balance`,
         date_formatted: `As On ${moment(startDate).format("DD MMM YYYY")}`
      }
      return row

   } catch (error) {
      console.error("Error calculating opening balance:", error);
      throw error;
   }
};
