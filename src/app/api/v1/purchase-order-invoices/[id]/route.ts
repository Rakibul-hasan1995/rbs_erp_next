


import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePurchaseOrderInvoice } from "../controllers/updateInvoice"
import { getPurchaseOrderInvoiceById } from "../controllers/getInvoiceById"

import { NextResponse } from "next/server"
import { checkLogger } from "@/app/api/auth/checkLogger"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      const body = await request.json()
      const data = await updatePurchaseOrderInvoice(id, body)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function GET(request: Request, { params }: { params: { id: string } }) {

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
      const data = await getPurchaseOrderInvoiceById(id, true)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })


}
