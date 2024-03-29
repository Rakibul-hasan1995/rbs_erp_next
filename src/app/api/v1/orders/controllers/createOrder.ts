import orderValidator from "@/app/api/lib/validation/createOrderValidation"
import { Order } from "@/app/api/mongoose/model/Order"
import { User } from "@/app/api/mongoose/model/User"
import { landingZeros } from "@/v1/utils/addLandingZero"
import moment from "moment"
import mongoose from "mongoose"
export const createOrder = async (body: any) => {
   try {


      const {
         customer,
         order_name,
         qty = 0,
         rate,
         currency = 'BDT',
         unit = 'Pcs',
         stitching = 0,
         category = 't-shirt',
         status = 'placed',
         description = '',
         order_date = new Date(),
         shipment_date = moment().add(15, 'days').toISOString(),
         cover_photo = '6505d20104fb8dcbd396ab6c',
         image_gallery = [cover_photo],
      } = body


      const tags: string[] = []

      const string = body?.tags || ""
      const arr = string.split(' ')
      arr.forEach((item: string) => tags.push(item))
      const customerData = await User.findById(customer)
      if (!customerData) {
         return { code: 400, data: { field: 'customer', value: '! customer is required' } }
      }

      tags.push(customerData.user_name)
      tags.push(order_name)

      let order = {
         customer,
         order_name,
         program_name: '',
         qty: +qty,
         rate: +rate,
         currency,
         unit,
         stitching,
         category,
         tags,
         status,
         description,
         order_date,
         shipment_date,
         image_gallery,
         cover_photo
      }
      const validate = orderValidator(order)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }

      // const clientOrderCount = await Order.countDocuments({ customer })
      // const lastOrder = await Order.findOne({}).sort({ _id: -1 })
      // const lastProgramSl = lastOrder?.program_name?.split('-')[0] || 0
      // order.program_name = `${landingZeros(+lastProgramSl + 1, 2)}-${landingZeros(clientOrderCount + 1, 2)}`

      const lastOrder = await Order.findOne({}).sort({ _id: -1 })
      const lastProgramSl = lastOrder?.program_name?.split('-')[0] || 0
      const programName = `${landingZeros(+lastProgramSl + 1, 2)}`
      order.program_name = programName
      tags.push(programName)



      const data = await Order.create(order)
      // sendNewNewOrderEmail(data)
      return { code: 201, data, links: [{ self: `/api/v1/orders/${data._id}` }] }
   } catch (error: any) {
      return { code: 500, message: error.message, error }
   }
}


