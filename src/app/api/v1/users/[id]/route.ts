// export async function GET(request: Request,) {

import dbConnect from "@/app/api/mongoose/mongoose"
import { deleteUser } from "../controllers/deleteUser"

export async function GET(request: Request, { params }: { params: { id: string } }) {

   const slug = params.id // 'a', 'b', or 'c'

   return Response.json({ slug })
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   dbConnect()
   const id = params.id // 'a', 'b', or 'c'
   const res = await deleteUser(id)
   return Response.json(res, { status: res.code })
}