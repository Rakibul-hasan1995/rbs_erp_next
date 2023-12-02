import dbConnect from "@/app/api/mongoose/mongoose"
import { Invoice } from "@/app/api/mongoose/model/Invoice"
import { NextResponse } from "next/server"
import { getInvoiceById } from "../../../invoices/controllers/getInvoiceById"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   try {
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
   } catch (error: any) {
      return NextResponse.json({ error, message: error.message, code: 500 }, { status: 500 })

   }
}
