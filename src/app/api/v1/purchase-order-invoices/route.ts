import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPurchaseOrderInvoice } from "./controllers/findPurchaseInvoice"
import { createPurchaseOrderInvoice } from "./controllers/createPurchaseOrderInvoice"
import { checkLogger } from '../../auth/checkLogger';

export const GET = async (req: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await findPurchaseOrderInvoice(req.url)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

export const POST = async (req: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const body = await req.json()
      const res = await createPurchaseOrderInvoice(body)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}
