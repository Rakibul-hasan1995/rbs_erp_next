

import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPurchaseOrder } from "./controllers/findPurchaseOrders"
import { createPurchaseOrder } from "./controllers/createPurchaseOrder"
import { checkLogger } from "../../auth/[...nextauth]/checkLogger"

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
      const res = await findPurchaseOrder(req.url)
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
      const res = await createPurchaseOrder(body)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

