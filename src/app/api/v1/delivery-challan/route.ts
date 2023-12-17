
import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findChallans } from "../receive-challans/controllers/findChallans"
import { DeliveryChallan } from "../../mongoose/model/Challan"
import { createChallan } from "../receive-challans/controllers/createChallan"

export const GET = async (req: Request) => {
   await dbConnect()
   const res = await findChallans(req.url, DeliveryChallan)
   return NextResponse.json(res, { status: res.code })
}
export const POST = async (req: Request) => {
   await dbConnect()
   const body = await req.json()
   const res = await createChallan(DeliveryChallan, body)
   return NextResponse.json(res, { status: res.code })
}
