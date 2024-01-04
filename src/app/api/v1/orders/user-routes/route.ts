import { checkLogger } from "@/app/api/auth/checkLogger";
import dbConnect from "@/app/api/mongoose/mongoose";
import { NextResponse } from "next/server";
import { findOrder } from './controllers/findOrder'


export async function GET(req: Request) {

   console.log('headers', req.headers)
   try {
      const user = await checkLogger()
 
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'user') {
         
         await dbConnect()
         const data = await findOrder(req.url)
         return NextResponse.json(data, { status: data.code })
      }

      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   } catch (error) {
      console.log(error)
      return NextResponse.json({ error }, { status: 500 })
   }
}
