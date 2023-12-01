import productionValidate from "@/app/api/lib/validation/createProductionValidation"
import { Production } from "@/app/api/mongoose/model/Production"


export const createProduction = async (body: any,) => {
   try {
      const {
         date,
         shift,
         machine_no,
         total_amount,
         production_data
      } = body
      const bodyData = {
         date,
         shift,
         machine_no,
         total_amount: +total_amount,
         production_data
      }
      const validate = productionValidate(bodyData)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }

      const data = await Production.create(body)
      return { code: 201, data, links: [{ self: `/api/v1/productions/${data._id}` }] }
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
}



