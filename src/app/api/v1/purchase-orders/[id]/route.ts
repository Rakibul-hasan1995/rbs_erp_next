import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePurchaseOrder } from "../controllers/updatePurchaseOrder"
import { getPurchaseOrderById } from "../controllers/getPurchaseOrderById"
import { deletePurchaseOrder } from "../controllers/deletePurchaseOrder"



export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updatePurchaseOrder(id, body)
   return Response.json(data, { status: data.code })
}
export async function GET(_request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await getPurchaseOrderById(id)
   return Response.json(data, { status: data.code })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await deletePurchaseOrder(id)
   return Response.json(data, { status: data.code })
}

 