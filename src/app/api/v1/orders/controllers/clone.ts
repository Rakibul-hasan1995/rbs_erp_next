
import { Order } from "@/app/api/mongoose/model/Order";
import { landingZeros } from "@/v1/utils/addLandingZero";
import mongoose from "mongoose";

export const cloneOrder = async (id: string) => {
   try {
      const order = await Order.findById(id)
      if (!order) {
         return { code: 404, message: 'order not found' }
      }
      // const order = new Order(oldOrder)

      order._id = new mongoose.Types.ObjectId()
      order.status = 'Placed'

      const clientOrderCount = await Order.countDocuments({ customer: order?.customer })
      const lastOrder = await Order.findOne({}).sort({ _id: -1 })
      const lastProgramSl = lastOrder?.program_name?.split('-')[0] || 0
      order.program_name = `${landingZeros(+lastProgramSl + 1, 2)}-${landingZeros(clientOrderCount + 1, 2)}`
      order.qty = 1
      order.order_date = new Date().toISOString()
      order.isNew = true

      const data = await order.save()
      return { code: 201, data, links: [{ self: `/api/v1/orders/${data._id}` }] }
   } catch (error: any) {
      return { code: 500, message: error.message , error}
   }
}
