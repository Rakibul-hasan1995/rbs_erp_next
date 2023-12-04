
import purchaseOrderInvoiceValidation from "@/app/api/lib/validation/purchaseOrderInvoiceValidation";
import { PurchaseOrderInvoice } from "@/app/api/mongoose/model/PurchaseOrderInvoice";
import { PurchaseOrder } from "@/app/api/mongoose/model/purchaseOrder";
import { landingZeros } from "@/v1/utils/addLandingZero";
import moment from "moment";
import mongoose from "mongoose";
import "@/app/api/mongoose/model/User";


export const createPurchaseOrderInvoice = async (body: any,) => {
   try {
      const validate = purchaseOrderInvoiceValidation(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const invoice = new PurchaseOrderInvoice(validate.data)
      // generate invoice_no
      const invCount = await PurchaseOrderInvoice.findOne({}).sort({ createdAt: -1 })
      if (invCount) {
         const count = invCount.invoice_no.split('-')
         invoice.invoice_no = `${moment().format("YY")}-${landingZeros(+count[1] + 1, 3)}`
      } else {
         invoice.invoice_no = `${moment().format("YY")}-${landingZeros(1, 3)}`
      }

      // generate customer bill no
      const customerInvCount = await PurchaseOrderInvoice.countDocuments({ supplier: body.supplier })
      invoice.supplier_bill_no = +customerInvCount + 1


      // generate amount
      const items = body.items.map((item: string) => new mongoose.Types.ObjectId(item))
      const orders = await PurchaseOrder.find({
         _id: {
            $in: items
         }
      })
         .populate('supplier', 'exchange_rate')
         .populate('order', 'currency cover_photo')



      if (!orders.length) {
         console.log('orders not found')
         return { code: 400, message: 'Something went wrong' }
      }



      const amount = orders.reduce((total, item: any) => {
         if (item.order?.currency == "USD" && typeof item.supplier?.exchange_rate == "number") {
            return total + Number(+item.qty / 12 * +item.rate) * +item.supplier.exchange_rate;
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


      await PurchaseOrder.updateMany(
         { _id: { $in: items } },
         { $set: { status: 'Invoiced' } }
      );

      if (orders) {
         const order: any = orders[0].order
        
         invoice.cover_photo = new mongoose.Types.ObjectId(`${order.cover_photo}`)
      }



      await invoice.save()
      return { code: 201, data: invoice, links: { self: `/api/v1/purchase-order-invoices/${invoice._id}` } }
   } catch (error: any) {
      console.log(error)
      return {
         code: 500, message: error.message, error
      }
   }

}

