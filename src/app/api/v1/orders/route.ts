import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { findOrder } from "./controllers/findOrder";
import { createOrder } from "./controllers/createOrder";
import { checkLogger } from "../../auth/[...nextauth]/checkLogger";
import { getQueryParams } from "../../lib/getQueryParams";

export async function GET(req: Request) {
   try {
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'customer') {
         return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
      }
      // if (user.roll == 'admin') {
      //    return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
      // }

      await dbConnect()
      const data = await findOrder(req.url)
      return NextResponse.json(data, { status: data.code })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

export async function POST(request: Request,) {
   const res = await request.json()
   const data = await createOrder(res)
   return Response.json(data, { status: data.code })
}