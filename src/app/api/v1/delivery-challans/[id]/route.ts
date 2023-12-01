
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { DeliveryChallan } from "@/app/api/mongoose/model/Challan"
import dbConnect from "@/app/api/mongoose/mongoose"
import { getChallanById } from "../../receive-challans/controllers/getChallanById"
import { updateChallan } from "../../receive-challans/controllers/updateChallan"
import { deleteChallanById } from "../../receive-challans/controllers/deleteChallan"
export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const expand = getQueryParams(request.url as string, 'expand', false)
   const data = await getChallanById(DeliveryChallan, id, expand)
   return Response.json(data, { status: data.code })
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updateChallan(DeliveryChallan, id, body)
   return Response.json(data, { status: data.code })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await deleteChallanById(DeliveryChallan, id)
   return Response.json(data, { status: data.code })
}


