import { NextResponse } from "next/server"
import { Gallery } from "../../mongoose/model/Gallery"
import dbConnect from "../../mongoose/mongoose"
import { findGallery } from "./controllers/findGallery"


export const GET = async (req: Request) => {
   await dbConnect()
   const res = await findGallery(req.url)
   return NextResponse.json(res, { status: res.code })
}

export const POST = async (req: Request) => {
   try {
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
   } catch (error: any) {
      return NextResponse.json({ code: 500, message: error.message, error }, { status: 500 })
   }
}
