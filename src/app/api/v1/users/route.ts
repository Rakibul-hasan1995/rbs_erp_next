import { NextResponse } from "next/server";
import dbConnect from "../../mongoose/mongoose";
import { findUsers } from "./controllers/findUsers";
import { createUser } from "./controllers/createUser";
import { checkLogger } from "../../auth/[...nextauth]/checkLogger";

export async function GET(req: Request) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, req.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const response = await findUsers(req)
      return NextResponse.json(response, { status: 200 })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function POST(request: Request,) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await request.json()
      const data = await createUser(res)
      return NextResponse.json(data, { status: 200 })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })


}