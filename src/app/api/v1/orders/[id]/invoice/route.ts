import dbConnect from "@/app/api/mongoose/mongoose"
import { Invoice } from "@/app/api/mongoose/model/Invoice"
import { NextResponse } from "next/server"
import { getInvoiceById } from "../../../invoices/controllers/getInvoiceById"
import { checkLogger } from "@/app/api/auth/checkLogger"


export async function GET(request: Request, { params }: { params: { id: string } }) {
   try {
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'customer') {
         return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
      }
      if (user.roll == 'admin') {
         await dbConnect()
         const id = params.id
         const invoice = await Invoice.findOne({
            'items': id
         })
         if (!invoice) {
            return NextResponse.json({ message: 'invoice not found' }, { status: 500 })
         }
         const data = await getInvoiceById(invoice._id, true)
         return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}