import { TransactionFormatted } from "@/types/transaction";
import transactionValidation from "./validation";
import { Account } from "../../mongoose/model/account";
import { Transaction } from "../../mongoose/model/transaction";
import { queryTransactions } from "./queryTransactions";


type Arg = {
   date: string | Date;
   paid_from_account: string;
   paid_to_account: string;
   amount: number;
   type: string;
   customer_id?: any
   supplier_id?: string;
   reference?: string;
   ref_id?: string[];
   status?: string
}
type Res = {
   success: boolean;
   data?: TransactionFormatted[];
   errors?: any

}
type CreateJournal = (arg: Arg) => Promise<Res>


export const createJournal: CreateJournal = async (body) => {

   try {
      const {
         date,
         paid_from_account,
         paid_to_account,
         amount,
         type,
      } = body

      const validate = transactionValidation(body)
      if (!validate.isValid) {
         return { success: false, data: undefined, errors: validate.error }
      }

      const paidAccount = await Account.findById(paid_from_account).exec()

      const expanseAccount = await Account.findById(paid_to_account).exec()

      if (!paidAccount) {
         return { success: false, data: undefined, errors: [{ field: 'paid_from_account', value: '! this account is not valid account for this transaction' }] }
      }
      if (!expanseAccount) {
         return { success: false, data: undefined, errors: [{ field: 'paid_TO_account', value: '! this account is not valid account for this transaction' }] }
      }

      // 'Opening Balance' | 'Settlement' | 'Expense' | "Income" | 'Invoice' | 'Customer Payment' | 'Purchases' | '';


      const drType = ['Settlement', 'Customer Payment']

      // Settlement 
      const debitTransaction = new Transaction({
         ...body,
         date,
         account_id: paid_from_account,
         paid_from_account,
         paid_to_account,
         debit_amount: +amount,
         type,
         customer_id: drType.includes(body.type) ? body.customer_id : null,
         supplier_id: body.type !== 'Expanse' ? body.supplier_id : null
      })

      const creditTransaction = new Transaction({
         ...body,
         date,
         account_id: paid_to_account,
         paid_from_account,
         paid_to_account,
         credit_amount: +amount,
         type,
         customer_id: !drType.includes(body.type) ? body.customer_id : null,
         supplier_id: body.type == 'Expanse' ? body.supplier_id : null,


         // relative_id: debitTransaction._id
      })

      creditTransaction.relative_id = debitTransaction._id
      debitTransaction.relative_id = creditTransaction._id

      await creditTransaction.save()
      await debitTransaction.save()
      const cr = await queryTransactions({ filter: { _id: creditTransaction._id } })
      const dr = await queryTransactions({ filter: { _id: debitTransaction._id } })

      return { success: true, data: [...dr.data, ...cr.data] }
   } catch (error) {

      console.log(error)
      throw error
   }
}