import { createJournal } from "@/app/api/lib/transactions/createJournal";

export const createTransaction = async (body: any) => {
   try {
      const { success, data, errors } = await createJournal(body)
      if (!success) {
         return { massage: 'Bad Request', errors, code: 400 }
      }
      return { massage: 'Success', data, code: 201 }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }

}

