
// router.get("/:_id", authentication, authorize(['admin']), getTransactionById);


import { NextResponse } from "next/server"
import { authorized } from "../../auth/authorized"
import dbConnect from "../../mongoose/mongoose"
import { createTransaction } from "./controllers/createTransaction"
import { findTransactions } from "./controllers/findTransaction"

export async function POST(req: Request) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const body = await req.json()
      const data = await createTransaction(body)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}



export async function GET(req: Request) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const data = await findTransactions(req.url)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

