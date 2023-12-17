import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findPurchaseOrderInvoice } from "./controllers/findPurchaseInvoice"
import { createPurchaseOrderInvoice } from "./controllers/createPurchaseOrderInvoice"
import { checkLogger } from '../../auth/[...nextauth]/checkLogger';

export const GET = async (req: Request) => {

   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const res = await findPurchaseOrderInvoice(req.url)
   return NextResponse.json(res, { status: res.code })
}

export const POST = async (req: Request) => {
   await dbConnect()
   const body = await req.json()
   const res = await createPurchaseOrderInvoice(body)
   return NextResponse.json(res, { status: res.code })
}
