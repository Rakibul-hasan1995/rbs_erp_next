
import dbConnect from "@/app/api/mongoose/mongoose"
import { getChallanById } from "../controllers/getChallanById"
import { ReceiveChallan } from "@/app/api/mongoose/model/Challan"
import { getQueryParams } from "@/app/api/lib/getQueryParams"
import { updateChallan } from "../controllers/updateChallan"
import { deleteChallanById } from "../controllers/deleteChallan"

export async function GET(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const expand = getQueryParams(request.url as string, 'expand', false)
   const data = await getChallanById(ReceiveChallan, id, expand)
   return Response.json(data, { status: data.code })
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updateChallan(ReceiveChallan, id, body)
   return Response.json(data, { status: data.code })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await deleteChallanById(ReceiveChallan, id)
   return Response.json(data, { status: data.code })
}


