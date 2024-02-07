import { Transaction } from "@/app/api/mongoose/model/transaction"

export const updateTransaction = async (body: any,id:string) => {
   try {
      const { date, amount, status, image } = body

      const drTransaction = await Transaction.findById(id)
      const crTransaction = await Transaction.findOne({ _id: drTransaction?.relative_id })

      if (!drTransaction || !crTransaction) {
         return {
            code: 400,
            message: 'Transaction not found'
         }
      }


      if (date) {
         drTransaction.date = date
         crTransaction.date = date
      }
      if (amount) {
         if (drTransaction?.debit_amount && drTransaction.debit_amount > 0) {
            drTransaction.debit_amount = amount
         }
         if (crTransaction?.debit_amount && crTransaction.debit_amount > 0) {
            crTransaction.debit_amount = amount
         }
         if (drTransaction?.credit_amount && drTransaction.credit_amount > 0) {
            drTransaction.credit_amount = amount
         }
         if (crTransaction?.credit_amount && crTransaction.credit_amount > 0) {
            crTransaction.credit_amount = amount
         }
      }
      if (status) {
         drTransaction.status = status
         crTransaction.status = status
      }
      if (image) {
         drTransaction.image = image
         crTransaction.image = image
      }

      // Object.assign(drTransaction, req.body)

      await drTransaction.save();
      await crTransaction.save();
      return {
         code: 200,
         data: [drTransaction, crTransaction],
         message: 'Successfully Update Data'
      }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }

}