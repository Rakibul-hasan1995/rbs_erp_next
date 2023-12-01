import dbConnect from "@/app/api/mongoose/mongoose"
import { getGroupProduction } from "../controllers/getGroupProduction"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
   try {
      await dbConnect()
      const response = await getGroupProduction(req.url)
      return NextResponse.json(response, { status: 200 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
