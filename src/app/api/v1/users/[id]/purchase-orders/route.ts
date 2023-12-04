import dbConnect from "@/app/api/mongoose/mongoose"
import { getPurchaseOrdersBySupplierId } from "./controller"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id // 'a', 'b', or 'c'
   const res = await getPurchaseOrdersBySupplierId(id, request.url)
   // return Response.json({})
   return Response.json(res, { status: res.code })
}