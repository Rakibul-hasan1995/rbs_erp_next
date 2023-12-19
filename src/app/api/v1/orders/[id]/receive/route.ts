import dbConnect from "@/app/api/mongoose/mongoose"
import { findChallanByOrder } from "../../../receive-challans/controllers/findChallanByOrderId"
import { ReceiveChallan } from "@/app/api/mongoose/model/Challan"
import { NextResponse } from "next/server"
import { checkLogger } from "@/app/api/auth/checkLogger"



export async function GET(request: Request, { params }: { params: { id: string } }) {
   try {
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'customer') {
         return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
      }
      if (user.roll == 'admin') {
         await dbConnect()
         const id = params.id
         const data = await findChallanByOrder(ReceiveChallan, request.url, id)
         return NextResponse.json(data, { status: 200 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}