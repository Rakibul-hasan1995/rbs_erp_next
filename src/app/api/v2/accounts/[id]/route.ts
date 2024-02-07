
import { authorized } from "@/app/api/auth/authorized"
import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { getAccountById } from "../controllers/getAccountById"





export async function GET(req: Request, { params }: { params: { id: string } }) {

   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const id = params.id
      const data = await getAccountById(req.url, id)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

