import { Production } from "@/app/api/mongoose/model/Production"
import { Trash } from "@/app/api/mongoose/model/Trash"

export const deleteProduction = async (id: string) => {
   try {
      const data = await Production.findById(id)
      if (!data) {
         return {
            code: 400, data: { filed: '_id', value: 'Order Not Found' }, message: 'Data Not Found'
         }
      }
      let trash = new Trash({
         _id: data._id,
         data: JSON.stringify(data),
         collectionName: 'production'
      })
      const suc = await trash.save()
      const del = await data.deleteOne()
      return {
         "code": 200,
         "message": "Successfully delete Data"
      }
   } catch (error: any) {
      return {
         "code": 500,
         "message": error.message
      }
   }
}