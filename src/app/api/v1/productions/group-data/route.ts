import dbConnect from "@/app/api/mongoose/mongoose"
import { getGroupProduction } from "../controllers/getGroupProduction"
import { NextResponse } from "next/server"
import { checkLogger } from "@/app/api/auth/checkLogger"


export async function GET(req: Request) {
   try {
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'customer') {
         return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
      }
      if (user.roll == 'admin') {
         await dbConnect()
         const response = await getGroupProduction(req.url)
         return NextResponse.json(response, { status: 200 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
