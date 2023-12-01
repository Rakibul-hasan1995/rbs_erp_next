import { Trash } from "@/app/api/mongoose/model/Trash"

export const deleteChallanById = async (Model: any, id: string, ) => {
   try {
    
      const challan = await Model.findById(id)
      if (!challan) {
         return {
            code: 400, data: { filed: '_id', value: 'Challan Not Found' }, message: 'Challan Not Found'
         }
      }

      let trash = new Trash({
         _id: challan._id,
         data: JSON.stringify(challan),
         collectionName: Model.collection.collectionName || 'challan'
      })
      const suc = await trash.save()
      const del = await challan.deleteOne()
      return {
         "code": 200,
         "message": "Successfully delete Data"
      }
   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }
}