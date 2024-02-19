import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { createOrder } from "./controllers/createOrder";
import { findOrder } from "./controllers/findOrder";
import { authorized } from "../../auth/authorized";


export async function GET(req: Request) {

   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }

      await dbConnect()
      const data = await findOrder(req.url)
      return NextResponse.json(data, { status: data.code })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }

      await dbConnect()
      const res = await req.json()
      const data = await createOrder(res)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

