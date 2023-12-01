import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { cloneOrder } from "../controllers/clone"
import { getOrderById } from "../controllers/getOrderById"
import { updateOrder } from "../controllers/updateOrder"
import dbConnect from "@/app/api/mongoose/mongoose"
import { deleteOrder } from "../controllers/deleteOrder"

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await cloneOrder(id)
   return Response.json(data, { status: data.code })
}
export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const body = await request.json()
   const id = params.id
   const data = await updateOrder(id, body)
   return Response.json(data, { status: data.code })
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const isExpand = getQueryParams(request.url as string, 'expand', false)
   const id = params.id
   const data = await getOrderById(id, isExpand)
   return Response.json(data, { status: data.code })
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await deleteOrder(id)
   return Response.json(data, { status: data.code })
}