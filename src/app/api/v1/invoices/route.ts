import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findInvoice } from "./controllers/findInvoice"
import { createInvoice } from "./controllers/createInvoice"

export const GET = async (req: Request) => {
   await dbConnect()
   const res = await findInvoice(req.url)
   return NextResponse.json(res, { status: res.code })
}
export const POST = async (req: Request) => {
   await dbConnect()
   const body = await req.json()
   const res = await createInvoice(body)
   return NextResponse.json(res, { status: res.code })
}



