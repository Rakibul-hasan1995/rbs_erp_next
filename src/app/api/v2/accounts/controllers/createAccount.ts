
import { accountValidation } from "@/app/api/lib/accounts/createAccountValidation";
import { Account } from "@/app/api/mongoose/model/account";
import mongoose from "mongoose";


type Body = {
   account_name: string;
   account_type: string;
   is_debit: boolean;
   is_system_account: boolean;
   status: 'active' | 'inactive';
   description?: string;
   createdBy: mongoose.Types.ObjectId
}


export const createAccount = async (body: Body,userId: string) => {
   try {
      const { account_name, account_type = 'expanse', is_debit = true, is_system_account = false, description = '', status = 'active' } = body
      const find = await Account.findOne({ account_name })
      if (find) {
         return { code: 400, message: 'Bad Request', data: [{ field: 'account_name', value: `"${account_name}" already exist please try another` }] }
      }

      const validate = accountValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const account = new Account({ account_name, account_type, is_debit, is_system_account, description, status, createdBy: userId })
      await account.save()

      return { code: 201, data: account, links: { self: `/api/v1/payments/${account._id}` } }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }

}

