import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findProductions } from "./controllers/findProductions"
import { createProduction } from "./controllers/createProduction"

export async function GET(req: Request) {
   try {
      await dbConnect()
      const response = await findProductions(req.url)
      return NextResponse.json(response, { status: 200 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}


export async function POST(request: Request,) {
   const res = await request.json()
   const data = await createProduction(res)
   return Response.json(data, { status: data.code })
}