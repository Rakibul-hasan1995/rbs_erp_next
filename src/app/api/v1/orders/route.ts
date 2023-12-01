import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { findOrder } from "./controllers/findOrder";
import { createOrder } from "./controllers/createOrder";

export async function GET(req: Request) {
   try {
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