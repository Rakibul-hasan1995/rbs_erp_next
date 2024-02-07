import { Transaction } from "@/app/api/mongoose/model/transaction"

export const getTransactionById = async (id: string) => {
   try {
      const transaction: any = await Transaction.findById(id)
      return {
         code: 200,
         data: transaction,
      }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}


