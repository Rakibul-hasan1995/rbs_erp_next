import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePayment } from "../controllers/updatePayment"
import { getPaymentById } from "../controllers/getPaymentById"
import { deletePayment } from "../controllers/deletePayment"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const data = await getPaymentById(id)
   return Response.json(data, { status: data.code })
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   const body = await request.json()
   const data = await updatePayment(id, body)
   return Response.json(data, { status: data.code })
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
   await dbConnect()
   const id = params.id
   
   const data = await deletePayment(id)
   return Response.json(data, { status: data.code })
}