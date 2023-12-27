import { NextResponse } from "next/server"
import { signup } from "../signin/controllers/signup"
import dbConnect from "../../mongoose/mongoose"

export const POST = async (request: Request) => {
   await dbConnect()
   const body = await request.json()
   const res = await signup(body)
   return NextResponse.json(res, { status: 200 })
}