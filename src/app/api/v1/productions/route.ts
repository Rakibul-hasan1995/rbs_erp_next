import { NextResponse } from "next/server"
import dbConnect from "../../mongoose/mongoose"
import { findProductions } from "./controllers/findProductions"
import { createProduction } from "./controllers/createProduction"
import { checkLogger } from "../../auth/[...nextauth]/checkLogger"


export const GET = async (request: Request) => {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const response = await findProductions(request.url)
      return NextResponse.json(response, { status: 200 })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}




export async function POST(request: Request,) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await request.json()
      const data = await createProduction(res)
      return Response.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}