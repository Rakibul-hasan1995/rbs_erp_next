import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { getGroupPayment } from "../controllers/getGroupPayment"
import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"

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
         const response = await getGroupPayment(req.url)
         return NextResponse.json(response, { status: 200 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
