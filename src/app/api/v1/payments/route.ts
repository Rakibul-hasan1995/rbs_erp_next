import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPayments } from "./controllers/findPayment"
import { createPayment } from "./controllers/createPayment"

export const GET = async (request: Request) => {
   await dbConnect()
   const res = await findPayments(request.url)
   return NextResponse.json(res, { status: res.code })
}
export const POST = async (request: Request) => {
   await dbConnect()
   const body = await request.json()
   const res = await createPayment(body)
   return NextResponse.json(res, { status: res.code })
}

