
import invoiceValidation from "@/app/api/lib/validation/createInvoiceValidation";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Order } from "@/app/api/mongoose/model/Order";
import { landingZeros } from "@/v1/utils/addLandingZero";
import moment from "moment";
import mongoose from "mongoose";

export const createInvoice = async (body: any) => {
   try {
      const validate = invoiceValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }

      const invoice = new Invoice(validate.data)

      // generate invoice_no
      const invCount = await Invoice.findOne({}).sort({ createdAt: -1 })
      if (invCount) {
         const count = invCount.invoice_no.split('-')[2]
         invoice.invoice_no = `inv-${moment().format("YY")}-${landingZeros(+count + 1, 3)}`
      } else {
         invoice.invoice_no = `${moment().format("YY")}-${landingZeros(1, 3)}`
      }

      // generate customer bill no
      const customerInvCount = await Invoice.countDocuments({ customer: body.customer })
      invoice.customer_bill_no = +customerInvCount + 1

      // generate amount
      const items = body.items.map((item: string) => new mongoose.Types.ObjectId(item))
      const orders = await Order.find({
         _id: {
            $in: items
         }
      }).populate('customer', 'exchange_rate')

      if (!orders.length) {
         console.log('orders not found')
         return { code: 400, message: 'Something went wrong' }
      }
      const amount = orders.reduce((total, item: any) => {
         if (item.currency == "USD" && typeof item.customer?.exchange_rate == "number") {
            return total + Number(+item.qty / 12 * +item.rate) * +item.customer.exchange_rate;
         } else if (typeof item.qty == "number" && typeof item.rate == "number") {

            return total + +item.qty * +item.rate;
         } else {
            // Handle invalid data or log a warning
            console.warn("Invalid data in orders:", item);
            return total;
         }
      }, 0);


      if (body.discount) {
         const discount = amount * 3 / 100;
         invoice.amount = amount - discount
      } else {
         invoice.amount = amount
      }

      await Order.updateMany(
         { _id: { $in: items } },
         { $set: { status: 'Invoiced' } }
      );
      const order = await Order.findById((invoice.items[0]))
      if (order) {
         invoice.cover_photo = new mongoose.Types.ObjectId(`${order.cover_photo}`)
      }

      await invoice.save()

      return { code: 201, data: invoice, links: { self: `/api/v1/invoice/${invoice._id}` } }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}





