import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findInvoice } from "./controllers/findInvoice"
import { createInvoice } from "./controllers/createInvoice"
import { checkLogger } from "../../auth/checkLogger"

export const GET = async (req: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await findInvoice(req.url)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}




export const POST = async (req: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const body = await req.json()
      const res = await createInvoice(body)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}



