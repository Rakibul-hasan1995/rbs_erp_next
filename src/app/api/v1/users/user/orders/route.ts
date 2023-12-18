import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"
import { NextResponse } from "next/server"
import { findOrder } from "../../../orders/controllers/findOrder"
import dbConnect from "@/app/api/mongoose/mongoose"

export async function GET(req: Request) {
   try {
   
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'user') {
         await dbConnect()
         const data: any = await findOrder(req.url)


         return NextResponse.json(data, { status: data.code })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
