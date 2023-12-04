

import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPurchaseOrder } from "./controllers/findPurchaseOrders"
import { createPurchaseOrder } from "./controllers/createPurchaseOrder"

export const GET = async (req: Request) => {
   await dbConnect()
   const res = await findPurchaseOrder(req.url)
   return NextResponse.json(res, { status: res.code })
}

export const POST = async (req: Request) => {
   await dbConnect()
   const body = await req.json()
   const res = await createPurchaseOrder(body)
   return NextResponse.json(res, { status: res.code })
}

