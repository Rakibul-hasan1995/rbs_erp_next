import { NextResponse } from "next/server"
import { signup } from "../signin-/controllers/signup"

export const POST = async (request: Request) => {
   const body = await request.json()
   const res = await signup(body)
   return NextResponse.json(res, { status: 200 })
}