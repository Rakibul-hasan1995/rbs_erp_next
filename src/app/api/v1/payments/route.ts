import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPayments } from "./controllers/findPayment"
import { createPayment } from "./controllers/createPayment"
import { checkLogger } from "../../auth/[...nextauth]/checkLogger"

export const GET = async (request: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await findPayments(request.url)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export const POST = async (request: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const body = await request.json()
      const res = await createPayment(body)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

