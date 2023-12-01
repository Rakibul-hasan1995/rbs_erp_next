import dbConnect from "@/app/api/mongoose/mongoose"
import { getOrders } from "../../controllers/getOrders"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id // 'a', 'b', or 'c'
   const res = await getOrders(id, request.url)
   // return Response.json({})
   return Response.json(res, { status: res.code })
}