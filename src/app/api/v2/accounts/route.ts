
// router.put("/:_id", authentication, authorize(), updateAccount);
// // router.delete("/:_id", authentication, authorize(), deleteDeliveryChallan);

import { NextResponse } from "next/server"
import { authorized } from "../../auth/authorized"
import dbConnect from "../../mongoose/mongoose"
import { createAccount } from "./controllers/createAccount"
import { findAccounts } from "./controllers/findAccounts"



export async function POST(req: Request) {
   try {
      const user = await authorized(['admin'])
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      await dbConnect()
      const body = await req.json()
      const data = await createAccount(body, user.id)
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
      const data = await findAccounts(req.url)
      return NextResponse.json(data, { status: data.code })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}

