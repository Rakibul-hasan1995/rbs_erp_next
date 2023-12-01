import { updateOrderValidation } from "@/app/api/lib/validation/updateOrderValidation";
import { Order } from "@/app/api/mongoose/model/Order";

export const updateOrder = async (id: string, body: any) => {
   try {
      const order = await Order.findById(id)
      if (!order) {
         return {
            code: 400,
            message: 'Order Not Found'
         }
      }
      const validate = updateOrderValidation(body);
      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }
      Object.assign(order, validate.updates)
      await order.save()
      return { code: 200, data: order, links: [{ self: `/api/v1/orders/${order?._id}` }] }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}


