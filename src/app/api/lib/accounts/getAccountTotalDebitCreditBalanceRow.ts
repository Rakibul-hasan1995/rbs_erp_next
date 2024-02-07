import { TransactionFormatted } from "@/types/transaction";
import moment from "moment";

import mongoose from "mongoose";
import { Transaction } from "../../mongoose/model/transaction";
import { numberWithCommas } from "@/v1/utils/numberFormater";

type GetTotalDCBalanceRow = (arg: {
   accountId: mongoose.Types.ObjectId;
   startDate: string;
   endDate: string;
   isDebit?: boolean;
}) => Promise<TransactionFormatted>



export const getAccountTotalDebitCreditBalanceRow: GetTotalDCBalanceRow = async ({ accountId, startDate, endDate }) => {
   try {
      // Create query object with accountId and date filter (transactions before startDate)
      const transactionQuery: any = {
         account_id: accountId,
         date: {
            $gte: new Date(moment(startDate).startOf('D').toISOString()),
            $lte: new Date(moment(endDate).endOf('D').toISOString())
         }
      };

      // Aggregate transactions before the start date
      const data = await Transaction.aggregate([
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

      const debit = data[0]?.debit || 0
      const credit = data[0]?.credit || 0

      const row: any = {
         date: endDate,
         credit_amount: credit,
         debit_amount: debit,
         credit_amount_formatted: numberWithCommas(credit),
         debit_amount_formatted: numberWithCommas(debit),
         type: '',
         transaction_details: `Total Debits and Credits ( ${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')} )`,
         date_formatted: ``
      }
      return row

   } catch (error) {
      console.error("Error calculating opening balance:", error);
      throw error;
   }
};
