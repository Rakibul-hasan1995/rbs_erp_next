import dbConnect from "@/app/api/mongoose/mongoose"
import { NextResponse } from "next/server"
import { findGalleryByOrder } from "../../controllers/getGalleryByOrderId"
import { authorized } from "@/app/api/auth/authorized"


export async function GET(_request: Request, { params }: { params: { id: string } }) {
   const user = await authorized(['admin', 'user'])
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   await dbConnect()
   const res = await findGalleryByOrder(params.id)
   return NextResponse.json(res, { status: res.code })
}

