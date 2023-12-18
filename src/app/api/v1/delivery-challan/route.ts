
import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findChallans } from "../receive-challans/controllers/findChallans"
import { DeliveryChallan } from "../../mongoose/model/Challan"
import { createChallan } from "../receive-challans/controllers/createChallan"
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
      const res = await findChallans(req.url, DeliveryChallan)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

export const POST = async (request: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const body = await request.json()
      const res = await createChallan(DeliveryChallan, body)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}
