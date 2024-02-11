import { transactionFormatter } from "@/app/api/lib/transactions/queryTransactions"
import { Transaction } from "@/app/api/mongoose/model/transaction"

export const getTransactionById = async (id: string) => {
   try {
      const transaction: any = await Transaction.findById(id)
         .populate('account_id', 'account_name')
         .populate('paid_from_account', 'account_name')
         .populate('paid_to_account', 'account_name')
         .populate('supplier_id', 'user_name')
         .populate('customer_id', 'user_name')

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


