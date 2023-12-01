import { Order } from "@/app/api/mongoose/model/Order";
import { getDelQtyBYOrderId } from "./helpers/getDelQtyByOrder_id";
import { getRecQtyBYOrderId } from "./helpers/getRecQtyByOrderId";
import { Production } from "@/app/api/mongoose/model/Production";
import { Invoice } from "@/app/api/mongoose/model/Invoice";
import '@/app/api/mongoose/model/Gallery'
import '@/app/api/mongoose/model/User'
export const getOrderById = async (id: string, expand: boolean) => {
   try {

      let extendsObj: any = {}
      let order = Order.findById(id)
         .populate('cover_photo', 'href')
         .populate('customer', 'user_name')

      if (expand) {
         order
            .populate('customer', 'user_name email')
            .populate('image_gallery', 'href')

         const deliveryInfo = await getDelQtyBYOrderId(id)
         extendsObj = { ...extendsObj, ...deliveryInfo }

         const receiveInfo = await getRecQtyBYOrderId(id)
         extendsObj = { ...extendsObj, ...receiveInfo }

         const production = await Production.find({ 'production_data.order': id })
         const prodQty = generateProductionQty(production, id)
         extendsObj.production_qty = prodQty

         const invoice = await Invoice.findOne({ 'items': id })

         extendsObj.invoice_amount = invoice?.amount

      } else {
         order
            .select('-image_gallery  -createdAt -updatedAt -__v')
      }
      let data = await order.exec()

      if (expand && data) {

         const orderData = { ...data, ...extendsObj }
         data = { ...orderData._doc, ...extendsObj }
      }

      return {
         code: 200,
         data,
      }
   } catch (error: any) {
      return {
         code: 500,
         message: error.message,
         error
      }
   }
};



const generateProductionQty = (items: any[], order_id: string) => {
   let totalQty = 0
   items.forEach((challan: { production_data: any[]; }) => {
      challan.production_data.forEach((item) => {
         if (item.order.toString() === order_id) {
            totalQty += item.qty;
         }
      });
   });
   return totalQty
}

