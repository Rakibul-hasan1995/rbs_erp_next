import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"

export const POST = async (req: Request) => {
   console.log(req.url)
   return NextResponse.json({ status: 200 })
}



