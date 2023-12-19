import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { signin } from "./controllers/signin"

export const POST = async (request: Request) => {
   await dbConnect()
   const body = await request.json()
   const data = await signin(body.email, body.password)
   return NextResponse.json(data, { status: data.code })
}

