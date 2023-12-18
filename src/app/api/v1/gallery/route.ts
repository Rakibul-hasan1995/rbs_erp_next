import { NextResponse } from "next/server"
import { Gallery } from "../../mongoose/model/Gallery"
import dbConnect from "../../mongoose/mongoose"
import { findGallery } from "./controllers/findGallery"
import { checkLogger } from "../../auth/[...nextauth]/checkLogger"





export async function GET(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      // return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   }
   if (user.roll == 'admin') {
      await dbConnect()
      const res = await findGallery(request.url)
      return NextResponse.json(res, { status: res.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export const POST = async (req: Request) => {
   try {

      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user.roll == 'admin') {
         await dbConnect()
         const body = await req.json()
         const { tags, href, name } = body
         if (!href) {
            return NextResponse.json({ code: 400, message: 'please provide img url' }, { status: 400 })
         }
         const gallery = {
            tags, href, name
         }
         const data = await Gallery.create(gallery)

         return NextResponse.json({ code: 201, data }, { status: 201 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   } catch (error: any) {
      return NextResponse.json({ code: 500, message: error.message, error }, { status: 500 })
   }
}
