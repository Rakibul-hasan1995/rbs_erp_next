import { NextResponse } from "next/server"
import emailHandler from "./sendInvoice"

export const POST = async (req: Request) => {
   // const res = await emailHandler()
  const file = await req.formData()

   const res = await emailHandler(file)

   return NextResponse.json({ status:200 })
}
