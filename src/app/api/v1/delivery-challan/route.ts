
import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findChallans } from "../receive-challans/controllers/findChallans"
import { DeliveryChallan } from "../../mongoose/model/Challan"
import { createChallan } from "../receive-challans/controllers/createChallan"
import { authorized } from "../../auth/authorized"

export const GET = async (req: Request) => {
   const user = await authorized(['admin', 'user'])
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const res = await findChallans(req.url, DeliveryChallan)
   return NextResponse.json(res, { status: res.code })
}

export const POST = async (request: Request) => {
   const user = await authorized(['admin'])
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const body = await request.json()
   const res = await createChallan(DeliveryChallan, body)
   return NextResponse.json(res, { status: res.code })

}
