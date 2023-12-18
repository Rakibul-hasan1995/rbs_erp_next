import dbConnect from "@/app/api/mongoose/mongoose"
import { updatePurchaseOrder } from "../controllers/updatePurchaseOrder"
import { getPurchaseOrderById } from "../controllers/getPurchaseOrderById"
import { deletePurchaseOrder } from "../controllers/deletePurchaseOrder"
import { checkLogger } from "@/app/api/auth/[...nextauth]/checkLogger"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const body = await request.json()
      const data = await updatePurchaseOrder(id, body)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}


export async function GET(request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'customer') {
      return NextResponse.redirect(new URL(`/api/v1/users/orders/${user.id}`, request.url))
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await getPurchaseOrderById(id)
      return NextResponse.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
   const user = await checkLogger()
   if (!user) {
      return NextResponse.json({ message: 'access denied' }, { status: 401 })
   }
   if (user.roll == 'admin') {
      await dbConnect()
      const id = params.id
      const data = await deletePurchaseOrder(id)
      return Response.json(data, { status: data.code })
   }
   return NextResponse.json({ message: 'access denied' }, { status: 401 })

}

