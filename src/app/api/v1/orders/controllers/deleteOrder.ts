import { Order } from "@/app/api/mongoose/model/Order";
import { Trash } from "@/app/api/mongoose/model/Trash";

export const deleteOrder = async (id: string) => {
   try {
      const order = await Order.findById(id)
      if (!order) {
         return { code: 400, data: { filed: '_id', value: 'Order Not Found' }, message: 'Data Not Found' }
      }
      let trash = new Trash({
         _id: order._id,
         data: JSON.stringify(order),
         collectionName: 'order'
      })
      const suc = await trash.save()
      const del = await order.deleteOne()
      return {
         "code": 200,
         "message": "Successfully delete Data"
      }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}
