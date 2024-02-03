import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { updateOrderValidation } from "@/app/api/lib/validation/updateOrderValidation";
import { Order } from "@/app/api/mongoose/model/Order";
import { getOrderById } from "./getOrderById";
// import { sendNewNewOrderEmail } from "@/app/api/email/email/sendOrderEmail";

export const updateOrder = async (id: string, body: any, expand = false) => {
   try {
      let order = await Order.findById(id)
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
      if (expand) {
         order = (await getOrderById(id, expand)).data
      }
      // sendNewNewOrderEmail(order)

      return { code: 200, data: order, links: [{ self: `/api/v1/orders/${order?._id}` }] }
   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}


