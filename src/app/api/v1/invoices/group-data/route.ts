import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import {  getGroupInvoice } from "../controllers/getGroupInvoice"

export async function GET(req: Request) {
   try {
      await dbConnect()
      const response = await getGroupInvoice(req.url)
      return NextResponse.json(response, { status: 200 })
   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
