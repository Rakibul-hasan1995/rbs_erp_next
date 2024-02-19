import productionValidate from "@/app/api/lib/validation/createProductionValidation"
import { History } from "@/app/api/mongoose/model/OrderHistory"
import { Production } from "@/app/api/mongoose/model/Production"
import mongoose from "mongoose"
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

      const history: any[] = []
      const productionRow = data?.production_data
      productionRow?.forEach((element: any) => {
         const obj = {
            parentId: element.order,
            title: 'Production',
            massage: `Make production in "${data?.shift}"`,
            data: { production: `${element.qty} Pcs` },
            time: data.date
         }
         history.push(obj)
      })
      await History.insertMany(history)

      return { code: 201, data, links: [{ self: `/api/v1/productions/${data._id}` }] }
   } catch (error: any) {
      console.log(error)
      return { code: 500, message: error.message, error }
   }
}



