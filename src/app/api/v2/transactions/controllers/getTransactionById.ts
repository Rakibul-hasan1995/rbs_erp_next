import { transactionFormatter } from "@/app/api/lib/transactions/queryTransactions"
import { Transaction } from "@/app/api/mongoose/model/transaction"

export const getTransactionById = async (id: string) => {
   try {
      const transaction: any = await Transaction.findById(id)
      let data = { ...transaction._doc }
      const formatted = transactionFormatter(data)
      return {
         code: 200,
         data: formatted,
      }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}


