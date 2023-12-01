
import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findChallans } from "./controllers/findChallans"
import { ReceiveChallan } from "../../mongoose/model/Challan"
import { createChallan } from "./controllers/createChallan"

export const GET = async (req: Request) => {
   await dbConnect()
   const res = await findChallans(req.url, ReceiveChallan)
   return NextResponse.json(res, { status: res.code })
}
export const POST = async (req: Request) => {
   await dbConnect()
   const body = await req.json()
   const res = await createChallan(ReceiveChallan, body)
   return NextResponse.json(res, { status: res.code })
}



