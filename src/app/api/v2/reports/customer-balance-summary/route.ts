import { authorized } from "@/app/api/auth/authorized"
import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { customerBalanceSummaryApiResponse } from "./controller"

export async function GET(req: Request) {
   try {
      // const user = await authorized(['admin'])
      // if (!user) {
      //    return NextResponse.json({ message: 'access denied' }, { status: 401 })
      // }
      await dbConnect()
      const data = await customerBalanceSummaryApiResponse()
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

