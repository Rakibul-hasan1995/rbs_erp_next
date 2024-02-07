import { authorized } from "@/app/api/auth/authorized"
import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { updateTransaction } from "../controllers/updateTransaction"
import { getTransactionById } from "../controllers/getTransactionById"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const body = await req.json()
      const data = await updateTransaction(body, params.id)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
export async function GET(req: Request, { params }: { params: { id: string } }) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
     
      const data = await getTransactionById(params.id)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
