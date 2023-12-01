import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { findUsers } from "./controllers/findUsers";
import { createUser } from "./controllers/createUser";

export async function GET(req: Request) {
   await dbConnect()

   try {
      const response = await findUsers(req)
      return NextResponse.json(response, { status: 200 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}


export async function POST(request: Request,) {
   const res = await request.json()
   const data = await createUser(res)
   return Response.json(data, { status: data.code })
}