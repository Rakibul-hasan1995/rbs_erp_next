
import { createJournal } from "@/app/api/lib/transactions/createJournal";
import invoiceValidation from "@/app/api/lib/validation/createInvoiceValidation";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import { Order } from "@/app/api/mongoose/model/Order";
import { History } from "@/app/api/mongoose/model/OrderHistory";
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

      const inv = await invoice.save()
      await createJournal({
         amount: invoice.amount,
         date: invoice.date,
         paid_from_account: "65b889de1cc3d73d85e8bd1b",
         paid_to_account: "65c0c17289eed83404adf657",
         // paid_from_account: "65c0c17289eed83404adf657",
         // paid_to_account: "65b88a8880a3b3419a5804ea",
         type: "Invoice",
         ref_id: inv._id,
         customer_id: invoice.customer,
         reference: `${invoice?.invoice_no}`
      })


      const history: any[] = []
      const invRow = inv.items
      invRow?.forEach((element: any) => {
         const obj = {
            parentId: new mongoose.Types.ObjectId(element.order),
            title: 'Invoiced',
            massage: `Make Invoice  "${inv.invoice_no}"`,
            data: {}
         }
         history.push(obj)
      })
      await History.insertMany(history)

      return { code: 201, data: invoice, links: { self: `/api/v1/invoice/${invoice._id}` } }

   } catch (error: any) {
      return { code: 500, message: error.message }
   }
}





