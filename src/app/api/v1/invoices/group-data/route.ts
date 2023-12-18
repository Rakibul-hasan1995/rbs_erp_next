import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { getGroupInvoice } from "../controllers/getGroupInvoice"
import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"

export async function GET(req: Request) {


   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const response = await getGroupInvoice(req.url)
      return NextResponse.json(response, { status: 200 })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}
