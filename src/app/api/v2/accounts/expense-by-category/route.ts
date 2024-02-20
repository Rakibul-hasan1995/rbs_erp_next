import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { getExpenseByCategory } from "./getExpenseByCategory"
import { authorized } from "@/app/api/auth/authorized"
export async function GET(req: Request) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const res = await getExpenseByCategory(req.url)
      return NextResponse.json(res, { status: res.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

