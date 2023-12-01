import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { getGroupPayment } from "../controllers/getGroupPayment"

export async function GET(req: Request) {
   try {
      await dbConnect()
      const response = await getGroupPayment(req.url)
      return NextResponse.json(response, { status: 200 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
