import { NextResponse } from "next/server"

export const POST =async (request:Request)=>{
   const body = await request.json()
   return NextResponse.json(body, {status: 200})

}