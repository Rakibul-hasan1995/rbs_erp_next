import { NextResponse } from "next/server"
import { checkLogger } from "@/app/api/auth/checkLogger"
import dbConnect from "@/app/api/mongoose/mongoose"
import { Gallery } from "@/app/api/mongoose/model/Gallery"
import { Order } from "@/app/api/mongoose/model/Order"


export const POST = async (req: Request) => {
   try {
      const user = await checkLogger()
      if (!user) {
         return NextResponse.json({ message: 'access denied' }, { status: 401 })
      }
      if (user) {
         await dbConnect()
         const body = await req.json()
         const tags: string[] = body.tags || ""
         const href: string = body.href
         const name: string = body.name || ""
         const orderId: string = body.orderId || null
         if (!href) {
            return NextResponse.json({ code: 400, message: 'please provide img url' }, { status: 400 })
         }

         const gallery = {
            tags, href, name
         }
         const data = await Gallery.create(gallery)
         if (orderId) {
            const order = await Order.findById(orderId)
            if (order) {
               const gallery = order.image_gallery
               gallery?.push(data._id)
               await order.save()
            }
         }

         return NextResponse.json({ code: 201, data }, { status: 201 })
      }
      return NextResponse.json({ message: 'access denied' }, { status: 401 })

   } catch (error: any) {
      return NextResponse.json({ code: 500, message: error.message, error }, { status: 500 })
   }
}
export const GET = async (req: Request) => {
   return NextResponse.json({ message: 'hello , this is get method, this method not allow' }, { status: 200 })
}
