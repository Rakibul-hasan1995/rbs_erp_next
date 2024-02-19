import { authorized } from "@/app/api/auth/authorized"
import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { findCustomerById } from "../controllers/findById"

export async function GET(req: Request, { params }: { params: { id: string } }) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()

      const res = await findCustomerById(req, params.id)
      return NextResponse.json(res, { status: res.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

