import { TransactionFormatted } from "@/types/transaction";
import moment from "moment";

import mongoose from "mongoose";
import { Transaction } from "../../mongoose/model/transaction";
import { numberWithCommas } from "@/v1/utils/numberFormater";
type GetClosingBalanceRow = (arg: {
   accountId: mongoose.Types.ObjectId;
   startDate: string;
   endDate: string;

}) => Promise<TransactionFormatted>



export const getAccountClosingBalanceRow: GetClosingBalanceRow = async ({ accountId, startDate, endDate }) => {
   try {

      const data = await Transaction.aggregate([
         {
            $match: {
               account_id: accountId,
               date: {
                  $lte: new Date(moment(endDate).endOf('D').toISOString())
               }
            }
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


      const clBalance = credit - debit

      const row: any = {
         account_id: new mongoose.Types.ObjectId(),
         date: new Date(endDate).toISOString(),
         credit_amount: clBalance > 0 ? clBalance : 0,
         debit_amount: clBalance < 0 ? clBalance : 0,
         type: '',
         transaction_details: `Closing Balance`,
         date_formatted: `As On ${moment(endDate).format("DD MMM YYYY")}`,
         credit_amount_formatted: clBalance > 0 ? numberWithCommas(clBalance) : '0.00',
         debit_amount_formatted: clBalance < 0 ? numberWithCommas(clBalance) : '0.00',
      }

      return row



   } catch (error) {
      console.error("Error calculating closing amount:", error);
      throw error
   }
}