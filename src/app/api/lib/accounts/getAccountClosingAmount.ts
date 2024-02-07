import { Transaction } from "../../mongoose/model/transaction";

export const getClosingAmount = async (accountId: string) => {
   try {
      const data = await Transaction.aggregate([
         {
            $match: {
               account_id: accountId
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

      return clBalance


   } catch (error) {
      console.error("Error calculating closing amount:", error);
      throw error
   }
}
