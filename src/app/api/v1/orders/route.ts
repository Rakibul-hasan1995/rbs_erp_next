import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { createOrder } from "./controllers/createOrder";
import { checkLogger } from "../../auth/checkLogger";
import { findOrder } from "./controllers/findOrder";


export async function GET(req: Request) {
   try {
      const user = await checkLogger()

      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'user') {
         const query = req.url.split('?')
         const userRoute = new URL(`/user-routes?${query[1]}`, req.url)

         return NextResponse.redirect(userRoute)
      }

      if (user.roll == 'admin') {
         await dbConnect()
         const data = await findOrder(req.url)
         return NextResponse.json(data, { status: data.code })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

export async function POST(req: Request) {
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
         const res = await req.json()
         const data = await createOrder(res)
         return NextResponse.json(data, { status: data.code })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

