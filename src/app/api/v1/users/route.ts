import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { findUsers } from "./controllers/findUsers";
import { createUser } from "./controllers/createUser";
import { authorized } from "../../auth/authorized";

export async function GET(req: Request) {
   const user = await authorized(['admin'])
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }

   await dbConnect()
   const response = await findUsers(req)
   return NextResponse.json(response, { status: 200 })
}


export async function POST(request: Request,) {
   const user = await authorized(['admin'])
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const res = await request.json()
   const data = await createUser(res)
   return NextResponse.json(data, { status: 200 })

}