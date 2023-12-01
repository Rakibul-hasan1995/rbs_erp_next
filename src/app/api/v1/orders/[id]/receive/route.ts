import dbConnect from "@/app/api/mongoose/mongoose"
import { findChallanByOrder } from "../../../receive-challans/controllers/findChallanByOrderId"
import { ReceiveChallan } from "@/app/api/mongoose/model/Challan"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await findChallanByOrder(ReceiveChallan, request.url, id)
   return Response.json(data, { status: data.code })
}
